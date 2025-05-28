
# My Social Network Feed

Questo è un feed personalizzato per Bluesky che mostra i contenuti (testo, immagini, video, repost, risposte) degli account che segui in ordine cronologico.

## Avvio del feed

1. Installa Deno:
   ```bash
   sudo pacman -Syu deno
   ```

2. Clona o copia questo repository sul server, ad esempio in `/opt/my-social-network-feed`.

3. Copia il file systemd:
   ```bash
   sudo cp systemd/bluesky-feed.service /etc/systemd/system/
   sudo systemctl daemon-reexec
   sudo systemctl enable --now bluesky-feed.service
   ```

4. Configura NGINX come reverse proxy su `feed.itsmy.social`, proxy_pass verso `localhost:8787`.

5. Visita `https://feed.itsmy.social` per vedere la pagina del feed.

## Registrazione su Bluesky

Segui la documentazione ufficiale su:
https://docs.bsky.app/docs/tutorials/custom-feeds

Assicurati che l'endpoint `/feed` sia raggiungibile e conforme al protocollo ATProto.
