import { createOpenAI } from "@ai-sdk/openai";
import type {
    TextMessagePart,
    ThreadAssistantMessagePart,
    ThreadMessage,
    ThreadSystemMessage,
    ThreadUserMessagePart,
} from "@assistant-ui/react";
import { streamText, type ModelMessage } from "ai";
import type { ActionFunctionArgs } from "react-router";

// Init OpenAI client
// TODO: extrapolate process.env stuff to a config file.
const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Helper: Convert ThreadMessage format to ModelMessage (AI SDK)
// TODO: put this in a util maybe
function convertThreadMessagesToCoreMessages(
    messages: ThreadMessage[]
): ModelMessage[] {
    const result: ModelMessage[] = [];

    for (const msg of messages) {
        if (!msg || !msg.role) {
            console.warn("Skipping invalid message:", msg);
            continue;
        }

        let content: string = "";

        // TODO: suppose this could be refactored to another helper... ?
        switch (msg.role) {
            case "user": {
                if (Array.isArray(msg.content)) {
                    content = msg.content
                        .filter(
                            (
                                part
                            ): part is Extract<
                                ThreadUserMessagePart,
                                { type: "text" }
                            > => part.type === "text"
                        )
                        .map((part) => part.text)
                        .join("");
                } else if (typeof msg.content === "string") {
                    content = msg.content;
                }

                if (content) {
                    result.push({
                        role: "user",
                        content: content,
                    });
                }
                break;
            }

            case "assistant": {
                if (Array.isArray(msg.content)) {
                    content = msg.content
                        .filter(
                            (
                                part
                            ): part is Extract<
                                ThreadAssistantMessagePart,
                                { type: "text" }
                            > => part.type === "text"
                        )
                        .map((part) => part.text)
                        .join("");
                } else if (typeof msg.content === "string") {
                    content = msg.content;
                }

                if (content) {
                    result.push({
                        role: "assistant",
                        content: content,
                    });
                }
                break;
            }

            case "system": {
                if (Array.isArray(msg.content)) {
                    content = msg.content
                        .filter(
                            (
                                part
                            ): part is Extract<
                                ThreadSystemMessage,
                                { type: "text" }
                            > => part.type === "text"
                        )
                        .map((part: TextMessagePart) => part.text)
                        .join("");
                } else if (typeof msg.content === "string") {
                    content = msg.content;
                }

                if (content) {
                    result.push({
                        role: "system",
                        content: content,
                    });
                }
                break;
            }

            default: {
                console.warn(
                    "Skipping unknown message role:",
                    (msg as ThreadMessage).role
                );
                break;
            }
        }
    }

    return result;
}

export async function action({ request }: ActionFunctionArgs) {
    try {
        const body = await request.json();

        const { messages } = body;

        if (!messages || !Array.isArray(messages)) {
            console.error("Invalid messages format:", messages);
            return new Response(
                JSON.stringify({
                    error: "Invalid messages format. Expected an array.",
                }),
                {
                    status: 400,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        const modelMessages = convertThreadMessagesToCoreMessages(messages);

        if (!process.env.OPENAI_API_KEY) {
            console.error("OPENAI_API_KEY is not set");
            return new Response(
                JSON.stringify({
                    error: "OpenAI API key is not configured",
                }),
                {
                    status: 500,
                    headers: { "Content-Type": "application/json" },
                }
            );
        }

        const result = streamText({
            model: openai("gpt-4o-mini"),
            messages: modelMessages,
        });

        return result.toUIMessageStreamResponse();
    } catch (error) {
        console.error("API error:", error);
        return new Response(
            JSON.stringify({
                error: error instanceof Error ? error.message : "Unknown error",
                details: error instanceof Error ? error.stack : String(error),
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}
