
# My Social Network Feed (multiutente, personalizzabile)

Feed Bluesky dinamico, personalizzato per ogni utente. Supporta filtri selezionabili via interfaccia web.

## Requisiti

- Deno (`sudo pacman -Syu deno`)
- Account tecnico Bluesky per login server
- `.env` con:
  ```
  BSKY_IDENTIFIER=your-handle.bsky.social
  BSKY_PASSWORD=your-password
  ```

## Funzionalità

- Post da following, ordinati cronologicamente
- Include/includi risposte, repost, solo mutuals
- Filtro per post con media o hashtag

## Deploy

1. Copia il progetto su `/opt/my-social-network-feed`
2. Crea `.env` come da esempio
3. Avvia il servizio:
```bash
sudo cp systemd/bluesky-feed.service /etc/systemd/system/
sudo systemctl daemon-reexec
sudo systemctl enable --now bluesky-feed.service
```

4. Configura NGINX per `feed.itsmy.social` → `localhost:8787`
5. Visita `https://feed.itsmy.social` per configurare e attivare il feed

## Registrazione

Registrati su https://bsky.app/settings/feeds con:
- URL: `https://feed.itsmy.social/feed`
