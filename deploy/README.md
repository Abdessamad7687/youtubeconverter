# Production converter runtime

The VPS uses two private systemd services:

- `totube-media-converter` runs the Node conversion API on `127.0.0.1:8788`.
- `totube-pot-provider` runs the pinned BgUtils provider on `127.0.0.1:4416`.

Install `bgutil-ytdlp-pot-provider` release `1.3.1`, verify the published SHA-256
digest, and patch the upstream server bind address from its temporary `::` /
`0.0.0.0` defaults to `127.0.0.1` before compiling it. Place the matching
plugin release zip in `/opt/totube/yt-dlp-plugins/` and configure:

```text
YTDLP_PLUGIN_DIRS=/opt/totube/yt-dlp-plugins
YTDLP_PO_TOKEN_PROVIDER_URL=http://127.0.0.1:4416
YTDLP_YOUTUBE_PLAYER_CLIENT=mweb
YTDLP_PROXY_HOSTS=youtube.com,youtu.be
YTDLP_FFMPEG_LOCATION=/opt/totube/bin
```

Port 4416 is an internal implementation detail and must not be exposed by
Nginx or the host firewall.

`totube.online.nginx.conf` is the production reverse-proxy configuration. Test
it with `nginx -t` before reloading Nginx; it keeps long conversion/download
timeouts while adding transport and browser security headers.
