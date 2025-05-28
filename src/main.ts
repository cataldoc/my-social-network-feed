
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { verifyJwtAndExtractDid } from "./jwt.ts";
import { getFeedForUser } from "./feed-logic.ts";

serve(async (req) => {
  const url = new URL(req.url);
  if (url.pathname !== "/feed") {
    return new Response("Not found", { status: 404 });
  }

  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new Response("Missing or invalid Authorization header", { status: 401 });
  }

  const token = authHeader.substring("Bearer ".length);
  try {
    const userDid = await verifyJwtAndExtractDid(token);
    const posts = await getFeedForUser(userDid);

    return new Response(JSON.stringify({ feed: "my-social-network", posts }), {
      headers: { "content-type": "application/json" },
    });
  } catch (err) {
    return new Response("Unauthorized: " + err.message, { status: 403 });
  }
}, { port: 8787 });
