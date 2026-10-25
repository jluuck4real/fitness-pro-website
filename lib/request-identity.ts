import { getChatGPTUser } from "@/app/chatgpt-auth";

export async function requestIdentity(
  request: Request,
): Promise<string | null> {
  if (process.env.VERCEL === "1") {
    // Only trust Vercel's proxy on Vercel, never caller-supplied ChatGPT headers.
    const address = request.headers
      .get("x-vercel-forwarded-for")
      ?.split(",")[0]
      ?.trim();
    if (!address) return null;
    const digest = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(address),
    );
    return `visitor-${Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("")}`;
  }
  return (await getChatGPTUser())?.userId ?? null;
}
