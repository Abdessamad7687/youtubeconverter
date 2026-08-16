import assert from "node:assert/strict";
import test from "node:test";
import { isThreadsUrl, resolveThreadsVideo } from "../backend/threads-policy.mjs";

test("recognizes canonical public Threads post links", () => {
  assert.equal(isThreadsUrl("https://www.threads.com/@creator/post/ABC_123-def"), true);
  assert.equal(isThreadsUrl("https://threads.net/@creator/post/ABC123"), true);
  assert.equal(isThreadsUrl("https://threads.com/@creator"), false);
});

test("selects the first MP4 from the exact requested Threads post", () => {
  const result = resolveThreadsVideo([
    { shortcode: "ABC123", media_urls: ["https://instagram.example.fbcdn.net/image.webp", "https://instagram.example.fbcdn.net/video.mp4?token=1"] },
  ], "https://www.threads.com/@creator/post/ABC123");
  assert.equal(result.mediaUrl, "https://instagram.example.fbcdn.net/video.mp4?token=1");
});

test("rejects mismatched or non-video Threads responses", () => {
  assert.throws(() => resolveThreadsVideo([{ shortcode: "WRONG", media_urls: ["https://instagram.example.fbcdn.net/video.mp4"] }], "https://threads.com/@creator/post/ABC123"), /correspond pas/);
  assert.throws(() => resolveThreadsVideo([{ shortcode: "ABC123", media_urls: ["https://instagram.example.fbcdn.net/image.webp"] }], "https://threads.com/@creator/post/ABC123"), /ne contient pas de vidéo/);
  assert.throws(() => resolveThreadsVideo([{ shortcode: "ABC123", media_urls: ["https://untrusted.example/video.mp4"] }], "https://threads.com/@creator/post/ABC123"), /ne contient pas de vidéo/);
});
