import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Chat UI" },
        { name: "description", content: "Chat UI application demo" },
    ];
}

export default function Home() {
    return <div>Home</div>;
}
