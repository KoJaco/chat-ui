import { LocalRuntimeProvider } from "~/components/providers/assistant-provider";

// Would usually put all providers here in order of dependency (e.g. LocalRuntimeProvider first, then ThemeProvider, ... etc)
export function Providers({ children }: { children: React.ReactNode }) {
    return <LocalRuntimeProvider>{children}</LocalRuntimeProvider>;
}
