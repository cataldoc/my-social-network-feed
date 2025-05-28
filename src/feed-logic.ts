
import { BskyAgent } from 'npm:@atproto/api';
import 'https://deno.land/std@0.177.0/dotenv/load.ts';

const identifier = Deno.env.get("BSKY_IDENTIFIER")!;
const password = Deno.env.get("BSKY_PASSWORD")!;

export async function getFeedPosts() {
  const agent = new BskyAgent({ service: "https://bsky.social" });
  await agent.login({ identifier, password });

  // Get user's DID
  const profile = await agent.getProfile({ actor: identifier });
  const userDid = profile.data.did;

  // Get following list
  const followingRes = await agent.app.bsky.graph.getFollows({
    actor: userDid,
    limit: 1000,
  });
  const followingDids = new Set(followingRes.data.follows.map(f => f.did));

  // Get timeline
  const timelineRes = await agent.getTimeline({ limit: 100 });
  const feedItems = timelineRes.data.feed;

  // Filter posts from followed users or their reposts/replies
  const filteredPosts = feedItems
    .filter(item => {
      const originator = item.post.author.did;
      const isFromFollowing = followingDids.has(originator);

      const isReply = item.post.record?.reply !== undefined;
      const isRepost = item.reason?.$type === "app.bsky.feed.defs#reasonRepost";
      const repostedByFollowing = item.reason && followingDids.has(item.reason.by.did);

      return (
        isFromFollowing || repostedByFollowing || isReply
      );
    })
    .map(item => item.post)
    .sort((a, b) => new Date(b.indexedAt).getTime() - new Date(a.indexedAt).getTime());

  return filteredPosts;
}
