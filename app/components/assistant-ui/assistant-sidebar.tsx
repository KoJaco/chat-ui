import type { FC } from "react";
import { Thread } from "~/components/assistant-ui/thread";

export const AssistantSidebar: FC = () => {
    return (
        <aside className="flex h-full w-full flex-col overflow-hidden bg-background md:w-[376px] lg:w-[410px] xl:w-[450px]">
            <Thread />
        </aside>
    );
};
