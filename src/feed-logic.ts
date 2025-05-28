
import { BskyAgent } from "npm:@atproto/api";
import { config } from "https://deno.land/std@0.224.0/dotenv/mod.ts";

const env = await config();
const agent = new BskyAgent({ service: "https://bsky.social" });

await agent.login({
  identifier: env.BSKY_USERNAME,
  password: env.BSKY_PASSWORD,
});

export async function getFeedPosts() {
  const timeline = await agent.getTimeline({ limit: 100 });

  const posts = timeline.data.feed
    .filter(item => item.post && !item.post.viewer?.muted && !item.post.viewer?.blocked)
    .map(item => item.post)
    .sort((a, b) => new Date(b.indexedAt).getTime() - new Date(a.indexedAt).getTime());

  return posts;
}
