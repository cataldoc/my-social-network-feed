import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { verifyJwtAndExtractDid } from "./jwt.ts";
import { getFeedForUser } from "./feed-logic.ts";

interface SkeletonItem {
  post: string;
  reason?: unknown;
}

interface SkeletonResponse {
  feed: string;
  cursor?: string;
  feed: SkeletonItem[];
}

serve(async (req) => {
  const url = new URL(req.url);

  // Solo l’endpoint XRPC corretto
  if (url.pathname !== "/xrpc/app.bsky.feed.getFeedSkeleton") {
    return new Response("Not found", { status: 404 });
  }

  // Parametro obbligatorio: URI del feed
  const feedUri = url.searchParams.get("feed");
  if (!feedUri) {
    return new Response("Missing feed parameter", { status: 400 });
  }

  // Header Authorization: JWT Bluesky
  const authHeader = req.headers.get("authorization") || "";
  if (!authHeader.startsWith("Bearer ")) {
    return new Response("Missing or invalid Authorization header", { status: 401 });
  }

  let userDid: string;
  try {
    userDid = await verifyJwtAndExtractDid(authHeader.slice("Bearer ".length));
  } catch (err) {
    return new Response("Unauthorized: " + err.message, { status: 403 });
  }

  // Parametri di query
  const cursorParam = url.searchParams.get("cursor");
  const limitParam = url.searchParams.get("limit");
  const limit = limitParam ? parseInt(limitParam, 10) : 50;

  const mediaOnly     = url.searchParams.get("mediaOnly")     === "true";
  const includeReplies = url.searchParams.get("includeReplies") !== "false";
  const includeReposts = url.searchParams.get("includeReposts") !== "false";
  const mutualsOnly   = url.searchParams.get("mutualsOnly")   === "true";
  const hashtags      = url.searchParams.get("hashtags")?.split("+") ?? [];

  // Genera il feed completo in base alle opzioni
  const posts = await getFeedForUser(userDid, {
    mediaOnly,
    includeReplies,
    includeReposts,
    mutualsOnly,
    hashtags
  });

  // Mappa a SkeletonItem (URI + motivo)
  const items: SkeletonItem[] = posts.map(post => {
    const ske: SkeletonItem = { post: post.uri };
    if ((post as any).reasonRepost) {
      ske.reason = (post as any).reasonRepost;
    }
    return ske;
  });

  // Calcola l’indice di partenza in base al cursore
  let startIndex = 0;
  if (cursorParam) {
    const idx = items.findIndex(item => item.post === cursorParam);
    startIndex = idx >= 0 ? idx + 1 : 0;
  }

  // Estrai la pagina corrente e il cursore successivo
  const pageItems = items.slice(startIndex, startIndex + limit);
  const nextCursor = pageItems.length === limit
    ? pageItems[pageItems.length - 1].post
    : undefined;

  // Risposta conforme a spec
  const responseBody: SkeletonResponse = {
    feed: feedUri,
    cursor: nextCursor,
    feed: pageItems,
  };

  return new Response(JSON.stringify(responseBody), {
    headers: { "content-type": "application/json" },
  });
}, { port: 8787 });

