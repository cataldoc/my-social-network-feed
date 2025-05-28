
import { BskyAgent } from 'npm:@atproto/api';

export async function getFeedForUser(userDid: string, options: any): Promise<any[]> {
  const agent = new BskyAgent({ service: "https://bsky.social" });
  await agent.login({ identifier: Deno.env.get("BSKY_IDENTIFIER")!, password: Deno.env.get("BSKY_PASSWORD")! });

  const profile = await agent.getProfile({ actor: userDid });
  const userFollowsRes = await agent.app.bsky.graph.getFollows({ actor: userDid, limit: 1000 });
  const userFollowersRes = await agent.app.bsky.graph.getFollowers({ actor: userDid, limit: 1000 });

  const followingDids = new Set(userFollowsRes.data.follows.map(f => f.did));
  const followersDids = new Set(userFollowersRes.data.followers.map(f => f.did));

  const mutuals = new Set([...followingDids].filter(did => followersDids.has(did)));

  const posts: any[] = [];

  for (const did of followingDids) {
    if (options.mutualsOnly && !mutuals.has(did)) continue;

    try {
      const feedRes = await agent.app.bsky.feed.getAuthorFeed({ actor: did, limit: 10 });
      for (const item of feedRes.data.feed) {
        const post = item.post;
        if (!post) continue;

        if (options.mediaOnly && !post.embed) continue;
        if (!options.includeReplies && post.record?.reply) continue;
        if (!options.includeReposts && item.reason?.$type === "app.bsky.feed.defs#reasonRepost") continue;
        if (options.hashtags.length) {
          const text = post.record?.text?.toLowerCase() || "";
          const containsHashtag = options.hashtags.some((h: string) => text.includes(`#${h.toLowerCase()}`));
          if (!containsHashtag) continue;
        }

        posts.push(post);
      }
    } catch (_) {
      continue;
    }
  }

  return posts
    .filter(p => p.indexedAt)
    .sort((a, b) => new Date(b.indexedAt).getTime() - new Date(a.indexedAt).getTime());
}
