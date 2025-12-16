import { openai } from "@ai-sdk/openai";
import { convertToModelMessages, streamText } from "ai";
import type { ActionFunctionArgs } from "react-router";

export async function action({ request }: ActionFunctionArgs) {
    const { messages } = await request.json();
    const result = streamText({
        model: openai("gpt-4o-mini"),
        messages: convertToModelMessages(messages),
    });
    return result.toUIMessageStreamResponse();
}
