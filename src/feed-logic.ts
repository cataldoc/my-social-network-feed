import { BskyAgent } from 'npm:@atproto/api';

interface PaginateParams {
  cursor?: string;
  limit: number;
  actor?: string;
}

async function paginate<T>(
  fn: (params: PaginateParams) => Promise<{ data: { cursor?: string; [key: string]: any } }>,
  key: string,
  initialParams: Omit<PaginateParams, 'cursor'>
): Promise<T[]> {
  const allItems: T[] = [];
  let cursor: string | undefined = undefined;
  do {
    const res = await fn({ ...initialParams, cursor });
    const items: T[] = res.data[key];
    allItems.push(...items);
    cursor = res.data.cursor;
  } while (cursor);
  return allItems;
}

export async function getFeedForUser(userDid: string, options: {
  mediaOnly: boolean;
  includeReplies: boolean;
  includeReposts: boolean;
  mutualsOnly: boolean;
  hashtags: string[];
}): Promise<any[]> {
  const agent = new BskyAgent({ service: 'https://bsky.social' });
  await agent.login({
    identifier: Deno.env.get('BSKY_IDENTIFIER')!,
    password: Deno.env.get('BSKY_PASSWORD')!
  });

  // 1. Paginazione di blocchi e silenzi
  const blocks = await paginate<{ did: string }>(
    params => agent.app.bsky.graph.getBlocks(params),
    'blocks',
    { actor: userDid, limit: 100 }
  );
  const blockedDids = new Set(blocks.map(b => b.did));

  const mutes = await paginate<{ did: string }>(
    params => agent.app.bsky.graph.getMutes(params),
    'mutes',
    { actor: userDid, limit: 100 }
  );
  const mutedDids = new Set(mutes.map(m => m.did));

  // 2. Paginazione di follows e followers
  const follows = await paginate<{ did: string }>(
    params => agent.app.bsky.graph.getFollows(params),
    'follows',
    { actor: userDid, limit: 1000 }
  );
  const followingDids = new Set(follows.map(f => f.did));

  const followers = await paginate<{ did: string }>(
    params => agent.app.bsky.graph.getFollowers(params),
    'followers',
    { actor: userDid, limit: 1000 }
  );
  const followersDids = new Set(followers.map(f => f.did));

  const mutuals = new Set([...followingDids].filter(did => followersDids.has(did)));

  // 3. Paginazione di authorFeed per ogni following
  const posts: any[] = [];
  for (const did of followingDids) {
    if (options.mutualsOnly && !mutuals.has(did)) continue;

    const feedItems = await paginate<any>(
      params => agent.app.bsky.feed.getAuthorFeed(params),
      'feed',
      { actor: did, limit: 100 }
    );

    for (const item of feedItems) {
      const post = item.post;
      if (!post) continue;

      // 4. Filtro blocchi e silenzi
      const authorDid = post.author.did;
      if (blockedDids.has(authorDid) || mutedDids.has(authorDid)) continue;
      if (item.reason?.$type === 'app.bsky.feed.defs#reasonRepost') {
        const reposterDid = item.reason.by.did;
        if (blockedDids.has(reposterDid) || mutedDids.has(reposterDid)) continue;
      }

      // 5. Altri filtri utente
      if (options.mediaOnly && !post.embed) continue;
      if (!options.includeReplies && post.record?.reply) continue;
      if (!options.includeReposts && item.reason?.$type === 'app.bsky.feed.defs#reasonRepost') continue;
      if (options.hashtags.length) {
        const text = post.record?.text?.toLowerCase() || '';
        const hasTag = options.hashtags.some(h => text.includes(`#${h.toLowerCase()}`));
        if (!hasTag) continue;
      }

      posts.push(post);
    }
  }

  // 6. Ordinamento cronologico
  return posts
    .filter(p => p.indexedAt)
    .sort((a, b) => new Date(b.indexedAt).getTime() - new Date(a.indexedAt).getTime());
}

