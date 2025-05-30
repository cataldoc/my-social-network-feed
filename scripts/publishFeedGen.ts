#!/usr/bin/env -S deno run --allow-env --allow-net
/**
 * publishFeedGen.ts
 *
 * Pubblica (o aggiorna) il record del tuo feed generator in
 * app.bsky.feed.generator, rendendolo visibile come algoritmo
 * personalizzato su Bluesky.
 */

import { BskyAgent } from "npm:@atproto/api";
import 'https://deno.land/std@0.177.0/dotenv/load.ts';

async function publish() {
  const agent = new BskyAgent({ service: "https://bsky.social" });
  await agent.login({
    identifier: Deno.env.get("BSKY_IDENTIFIER")!,
    password: Deno.env.get("BSKY_PASSWORD")!,
  });

  // Definisci il record da pubblicare
  const record = {
    $type: "app.bsky.feed.generator",
    did: agent.session!.did,
    displayName: "My Social Network",
    description: "Feed cronologico personalizzato dai tuoi following.",
    algorithm: {
      $type: "app.bsky.feed.generator#algorithm",
      uri: "at://feed.itsmy.social/xrpc/app.bsky.feed.getFeedSkeleton?feed=at://feed.itsmy.social/feed/my-social-network",
    },
    // opzionale: icona, contatti, tags...
  };

  // Crea o aggiorna il record
  const response = await agent.com.atproto.repo.createRecord({
    repo: agent.session!.did,
    collection: "app.bsky.feed.generator",
    record,
  });

  console.log("Feed generator pubblicato:", response.uri);
}

publish().catch(err => {
  console.error("Errore di pubblicazione:", err);
  Deno.exit(1);
});

