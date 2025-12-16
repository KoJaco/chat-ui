import {
    AssistantRuntimeProvider,
    useLocalRuntime,
    type ChatModelAdapter,
    type ModelContext,
    type ThreadMessage,
} from "@assistant-ui/react";

import type { ReactNode } from "react";

// https://www.assistant-ui.com/docs/runtimes/custom/local
// Streaming implementation following: https://www.assistant-ui.com/docs/runtimes/custom/local#streaming-responses

const ModelAdapter: ChatModelAdapter = {
    async *run({ messages, abortSignal, context }) {
        const res = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ messages }),
            signal: abortSignal,
        });

        if (!res.ok) {
            throw new Error(`API request failed: ${res.statusText}`);
        }

        if (!res.body) {
            throw new Error("Response body is null");
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let text = "";

        try {
            while (true) {
                const { done, value } = await reader.read();

                if (done) {
                    break;
                }

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split("\n");
                buffer = lines.pop() || "";

                for (const line of lines) {
                    if (!line.trim()) continue;

                    // Handle SSE format (data: {...})
                    if (line.startsWith("data: ")) {
                        // TODO: make sure this is correct
                        const data = line.slice(6);
                        if (data === "[DONE]") {
                            continue;
                        }

                        try {
                            const chunk = JSON.parse(data);

                            // Handle UI message stream format from ai SDK... e.g., { type: "text-delta", textDelta: "..." }
                            if (
                                chunk.type === "text-delta" &&
                                chunk.textDelta
                            ) {
                                text += chunk.textDelta;
                                yield {
                                    content: [{ type: "text", text }],
                                };
                                // Text chunks
                            } else if (chunk.type === "text" && chunk.text) {
                                text = chunk.text;
                                yield {
                                    content: [{ type: "text", text }],
                                };
                                // Tool calls
                            } else if (chunk.type === "tool-call") {
                                const args = chunk.args || {};
                                yield {
                                    content: [
                                        {
                                            type: "tool-call" as const,
                                            toolCallId: chunk.toolCallId,
                                            toolName: chunk.toolName,
                                            args: args,
                                            argsText: JSON.stringify(args),
                                        },
                                    ],
                                };
                            }
                        } catch (e) {
                            console.warn("Failed to parse chunk:", line, e);
                        }
                    } else if (line.trim()) {
                        // Try parsing as direct JSON for non-SSE format
                        try {
                            const chunk = JSON.parse(line);
                            if (
                                chunk.type === "text-delta" &&
                                chunk.textDelta
                            ) {
                                text += chunk.textDelta;
                                yield {
                                    content: [{ type: "text", text }],
                                };
                            } else if (chunk.type === "text" && chunk.text) {
                                text = chunk.text;
                                yield {
                                    content: [{ type: "text", text }],
                                };
                            }
                        } catch (e) {
                            // skipp
                        }
                    }
                }
            }
        } finally {
            reader.releaseLock();
        }
    },
};

export function LocalRuntimeProvider({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    const runtime = useLocalRuntime(ModelAdapter);
    return (
        <AssistantRuntimeProvider runtime={runtime}>
            {children}
        </AssistantRuntimeProvider>
    );
}
