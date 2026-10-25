// Server-only configuration for Next.js/Vercel. Never import from client components.
export function serverEnvironment(): Record<string, string | undefined> {
  return process.env;
}
