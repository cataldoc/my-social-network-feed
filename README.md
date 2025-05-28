
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

## 🔧 Configurazione NGINX

Esempio di configurazione NGINX per `feed.itsmy.social`:

```
server {
    listen 80;
    listen [::]:80;
    server_name feed.itsmy.social;

    location / {
        proxy_pass http://127.0.0.1:8787;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### HTTPS (Let’s Encrypt)
Per proteggere il dominio con HTTPS tramite Let’s Encrypt:

1. Installa `certbot` e plugin nginx:
   ```bash
   sudo pacman -Syu certbot certbot-nginx
   ```

2. Esegui la configurazione SSL automatica:
   ```bash
   sudo certbot --nginx -d feed.itsmy.social
   ```

3. Verifica che l’auto-rinnovo sia attivo:
   ```bash
   sudo systemctl list-timers | grep certbot
   ```

⚠️ Se usi Cloudflare, assicurati che il proxy (nuvola arancione) sia **attivo** e il certificato sia in modalità **Full** o **Flexible**.

