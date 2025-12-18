import type { Route } from "./+types/home";
import { AssistantSidebar } from "~/components/assistant-ui/assistant-sidebar";
import { ThreadList } from "~/components/assistant-ui/thread-list";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Chat UI" },
        { name: "description", content: "Chat UI application demo" },
    ];
}

export default function Home() {
    return (
        <div className="h-screen overflow-hidden flex items-center justify-center p-4 bg-background py-24">
            <div className="w-full max-w-5xl max-h-[700px] h-full flex flex-col border rounded-xl shadow-xl bg-card overflow-hidden">
                <AssistantSidebar>
                    <div className="h-full flex flex-col p-4 border-r bg-muted/30 overflow-y-auto">
                        <ThreadList />
                    </div>
                </AssistantSidebar>
            </div>
        </div>
    );
}
