
# My Social Network Feed (multiutente)

Feed personalizzato per Bluesky, dinamico per ogni utente in base al proprio account.

## Caratteristiche
- Contenuti cronologici dai following
- Include repost, citazioni e risposte
- Rispetta blocchi e silenzi dell'utente (gestibili lato Bluesky)
- Accesso via token JWT firmato (standard Bluesky)

## Requisiti
- Deno (`sudo pacman -Syu deno`)

## Deploy
1. Copia il progetto in `/opt/my-social-network-feed`
2. Avvia con systemd:

```bash
sudo cp systemd/bluesky-feed.service /etc/systemd/system/
sudo systemctl daemon-reexec
sudo systemctl enable --now bluesky-feed.service
```

3. Configura NGINX per esporre `feed.itsmy.social` verso `localhost:8787`

## Registrazione del feed su Bluesky

Segui: https://docs.bsky.app/docs/tutorials/custom-feeds
Usa endpoint: `https://feed.itsmy.social/feed`
