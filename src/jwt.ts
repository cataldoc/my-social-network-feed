
import { jwtVerify } from "npm:jose";
import { createRemoteJWKSet } from "npm:jose";

const JWKS = createRemoteJWKSet(new URL("https://bsky.social/.well-known/jwks.json"));

export async function verifyJwtAndExtractDid(token: string): Promise<string> {
  const { payload } = await jwtVerify(token, JWKS);
  if (typeof payload.sub !== "string") throw new Error("Missing DID");
  return payload.sub;
}
