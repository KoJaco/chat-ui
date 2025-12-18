import type { FC } from "react";

export const MainContent: FC = () => {
    return (
        <div className="flex h-full w-full flex-col items-center justify-center p-8 border-r border-t">
            <div className="flex max-w-2xl flex-col items-center gap-4 text-center">
                <h1 className="text-4xl font-semibold tracking-tight">
                    Welcome to Chat UI
                </h1>
                <p className="text-muted-foreground text-lg">
                    Use the chat assistant on the right to interact with AI.
                    Start a conversation to see how it works.
                </p>
            </div>
        </div>
    );
};
