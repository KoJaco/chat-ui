import {
    AssistantRuntimeProvider,
    useLocalRuntime,
    type ChatModelAdapter,
} from "@assistant-ui/react";

import type { ReactNode } from "react";

// https://www.assistant-ui.com/docs/runtimes/custom/local
// !not set up for streaming yet. Test this for now.
const ModelAdapter: ChatModelAdapter = {
    async run({ messages, abortSignal, context }) {
        // TODO: test api call
        const res = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            // Forward message in the chat to api route
            body: JSON.stringify({ messages }),
            // TODO: test user 'cancel' button + escape key... see cancel work
            signal: abortSignal,
        });

        const data = await res.json();

        return { content: [{ type: "text", text: data.text }] };
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
