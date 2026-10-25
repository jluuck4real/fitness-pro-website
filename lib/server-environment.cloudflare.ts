import { env } from "cloudflare:workers";

// The existing Sites build selects this adapter through Vite's alias.
export function serverEnvironment(): Record<string, string | undefined> {
  return {
    ...process.env,
    ...(env as unknown as Record<string, string | undefined>),
  };
}
