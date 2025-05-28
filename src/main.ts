
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { getFeedPosts } from "./feed-logic.ts";

serve(async (req) => {
  const url = new URL(req.url);
  if (url.pathname === "/feed") {
    const posts = await getFeedPosts();
    return new Response(JSON.stringify({ feed: "my-social-network", posts }), {
      headers: { "content-type": "application/json" },
    });
  }

  return new Response("My Social Network Feed Generator", {
    headers: { "content-type": "text/plain" },
  });
}, { port: 8787 });
