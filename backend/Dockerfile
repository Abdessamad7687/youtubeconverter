FROM node:24-bookworm-slim

RUN apt-get update \
  && apt-get install -y --no-install-recommends ffmpeg python3 python3-pip ca-certificates \
  && pip3 install --break-system-packages --no-cache-dir "yt-dlp[default]" \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY server.mjs ./server.mjs

RUN useradd --create-home --uid 10001 totube \
  && mkdir -p /var/tmp/totube \
  && chown -R totube:totube /app /var/tmp/totube

USER totube
ENV PORT=8788 \
    WORK_DIR=/var/tmp/totube \
    FFMPEG_BIN=ffmpeg \
    FFPROBE_BIN=ffprobe \
    MAX_DURATION_SECONDS=1200 \
    MAX_FILESIZE=500M \
    FILE_TTL_MINUTES=30 \
    MAX_CONCURRENT_JOBS=2 \
    RATE_LIMIT_PER_HOUR=12

EXPOSE 8788
HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD node -e "fetch('http://127.0.0.1:8788/health').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))"
CMD ["node", "server.mjs"]
