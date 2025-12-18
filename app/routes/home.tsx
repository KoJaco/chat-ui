import type { Route } from "./+types/home";
import { AssistantSidebar } from "~/components/assistant-ui/assistant-sidebar";
import { MainContent } from "~/components/assistant-ui/main-content";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Chat UI" },
        { name: "description", content: "Chat UI application demo" },
    ];
}

export default function Home() {
    return (
        <div className="flex h-screen w-full overflow-hidden bg-background">
            <main className="flex flex-1 overflow-hidden">
                <MainContent />
            </main>
            <AssistantSidebar />
        </div>
    );
}
