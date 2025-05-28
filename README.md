
# My Social Network Feed

Un feed personalizzato Bluesky con contenuti cronologici dai tuoi following.

## Requisiti

- [Deno](https://deno.land/) (`sudo pacman -Syu deno`)
- File `.env` con credenziali Bluesky:
  ```env
  BSKY_IDENTIFIER=tuo@handle.bsky.social
  BSKY_PASSWORD=la_tua_password
  ```

## Setup

1. Clona questo repository su `/opt/my-social-network-feed`
2. Crea il file `.env` copiando `.env.example`
3. Avvia il servizio:

```bash
sudo cp systemd/bluesky-feed.service /etc/systemd/system/
sudo systemctl daemon-reexec
sudo systemctl enable --now bluesky-feed.service
```

4. Configura NGINX per servire `feed.itsmy.social` verso `localhost:8787`

## Feed su Bluesky

Il feed sarà disponibile all’URL: `https://feed.itsmy.social/feed`
Registralo tramite l’interfaccia [https://bsky.app/settings/feeds](https://bsky.app/settings/feeds)
