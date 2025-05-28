
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

serve(async (req) => {
  const url = new URL(req.url);
  if (url.pathname === "/feed") {
    const response = {
      feed: "my-social-network",
      posts: [], // Qui andrà la logica del feed
    };
    return new Response(JSON.stringify(response), {
      headers: { "content-type": "application/json" },
    });
  }

  return new Response("My Social Network Feed Generator", {
    headers: { "content-type": "text/plain" },
  });
}, { port: 8787 });
