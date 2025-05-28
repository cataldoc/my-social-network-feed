
import { BskyAgent } from 'npm:@atproto/api';

export async function getFeedForUser(userDid: string): Promise<any[]> {
  const agent = new BskyAgent({ service: "https://bsky.social" });

  // Recupera lista dei following
  const followsRes = await agent.app.bsky.graph.getFollows({
    actor: userDid,
    limit: 1000,
  });

  const followingDids = new Set(followsRes.data.follows.map(f => f.did));

  // Inizializza array per i post
  const posts: any[] = [];

  for (const did of followingDids) {
    try {
      const feedRes = await agent.app.bsky.feed.getAuthorFeed({
        actor: did,
        limit: 10,
      });
      for (const item of feedRes.data.feed) {
        if (item.post) {
          posts.push(item.post);
        }
      }
    } catch (_) {
      continue; // ignora errori singoli
    }
  }

  // Ordina cronologicamente
  return posts
    .filter(p => p.indexedAt)
    .sort((a, b) => new Date(b.indexedAt).getTime() - new Date(a.indexedAt).getTime());
}
