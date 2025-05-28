
import { BskyAgent } from "npm:@atproto/api";

export async function getFeedPosts() {
  const agent = new BskyAgent({ service: "https://bsky.social" });
  await agent.login({ identifier: "<USERNAME>", password: "<PASSWORD>" });

  const timeline = await agent.getTimeline({ limit: 50 });
  const posts = timeline.data.feed.filter(item => {
    return item.post && !item.reason?.blocked; // esempio base
  });

  return posts.map(item => item.post);
}
