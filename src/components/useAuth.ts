import { getQuickIdentity } from "@ave-id/sdk/client";

export function useAuth() {
  const identity = getQuickIdentity();
  return { isAuthenticated: !!identity, loading: false };
}
