# toTube converter backend

Container-ready conversion API used by the toTube Next.js frontend. It runs
`yt-dlp` and FFmpeg, returns MP3, M4A, or MP4 files, and uses the same response
shape as the frontend's existing converter adapter.

MP4 downloads prefer native H.264/AAC streams. If a platform only returns AV1,
VP9, or another incompatible codec, the backend automatically transcodes it to
H.264 High Compatibility (`yuv420p`) plus AAC and enables MP4 fast-start.

## Run locally

From the repository root, use `npm run dev`. The frontend starts on port 3000
and this service starts on port 8788 using the root `.env.local` file.

## Run as a container

Copy `.env.example` to `.env`, set a strong API key and the public HTTPS URL,
then run `docker compose up --build -d` from this directory.

The public host must support long-running HTTP requests and provide enough
temporary disk for simultaneous media conversions. Files expire automatically.
