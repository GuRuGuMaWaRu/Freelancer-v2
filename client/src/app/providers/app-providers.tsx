import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { AuthProvider } from "./auth.provider";
import { NotificationProvider } from "./notification.provider";

const FIVE_MINUTES_MS = 5 * 60 * 1000;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: FIVE_MINUTES_MS,
    },
  },
});

function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        <AuthProvider>{children}</AuthProvider>
      </NotificationProvider>
      <ReactQueryDevtools position="bottom-right" />
    </QueryClientProvider>
  );
}

export { AppProviders, queryClient };
