
# My Social Network Feed

Un feed personalizzato per Bluesky che mostra post da account seguiti, ordinati cronologicamente, inclusi repost, risposte e citazioni.

## Requisiti

- Deno (`sudo pacman -Syu deno`)
- Account Bluesky con username/password

## Setup

1. Copia i file su `/opt/my-social-network-feed`
2. Modifica `src/feed-logic.ts` inserendo il tuo username e password Bluesky
3. Avvia con systemd:

```bash
sudo cp systemd/bluesky-feed.service /etc/systemd/system/
sudo systemctl daemon-reexec
sudo systemctl enable --now bluesky-feed.service
```

4. Configura NGINX su `feed.itsmy.social` come reverse proxy su `localhost:8787`
5. Visita `https://feed.itsmy.social`

## Registrazione su Bluesky

Registrati su https://bsky.app/settings/feeds
