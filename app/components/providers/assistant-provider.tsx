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
        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ messages }),
                signal: abortSignal,
            });

            if (!res.ok) {
                const errorText = await res.text().catch(() => res.statusText);
                console.error("API request failed:", {
                    status: res.status,
                    statusText: res.statusText,
                    error: errorText,
                });
                throw new Error(
                    `API request failed: ${res.status} ${res.statusText} - ${errorText}`
                );
            }

            if (!res.body) {
                throw new Error("Response body is null");
            }

            // Convert ReadableStream to async iterable
            const stream = res.body;
            const reader = stream.getReader();
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
                            const data = line.slice(6);
                            if (data === "[DONE]") {
                                continue;
                            }

                            try {
                                const chunk = JSON.parse(data);

                                // Handle UI message stream format from ai SDK
                                if (chunk.type === "text-delta") {
                                    // text-delta chunks contain incremental text
                                    // Check for textDelta property (could be empty string or null)
                                    const delta =
                                        chunk.textDelta ?? chunk.delta ?? "";

                                    text += delta;

                                    yield {
                                        content: [{ type: "text", text }],
                                    };
                                } else if (chunk.type === "text") {
                                    // Complete text chunk
                                    text = chunk.text || "";
                                    if (text) {
                                        yield {
                                            content: [{ type: "text", text }],
                                        };
                                    }
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
                                } else if (
                                    chunk.type === "start" ||
                                    chunk.type === "start-step" ||
                                    chunk.type === "text-start" ||
                                    chunk.type === "text-end" ||
                                    chunk.type === "finish" ||
                                    chunk.type === "finish-step"
                                ) {
                                    // console.log("control chunk: ", chunk.type);
                                    // Control chunks - they're metadata.. can ignore
                                } else {
                                    // console.log("Unhandled chunk type: ", chunk.type);
                                    // ignore
                                }
                            } catch (e) {
                                console.warn("Failed to parse chunk:", line, e);
                            }
                        }
                    }
                }
            } finally {
                reader.releaseLock();
            }
        } catch (error) {
            console.error("ModelAdapter error:", error);
            throw error;
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
