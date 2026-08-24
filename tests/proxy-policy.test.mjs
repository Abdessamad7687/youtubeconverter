import assert from "node:assert/strict";
import test from "node:test";
import { isProxyMediaFailure, isTransportFailure, isYouTubeChallenge, orderedProxyRoutes } from "../backend/proxy-policy.mjs";

test("recognizes YouTube authentication challenges without treating them as proxy outages", () => {
  const error = new Error("ERROR: Sign in to confirm you’re not a bot. Use --cookies for authentication.");
  assert.equal(isYouTubeChallenge(error), true);
  assert.equal(isTransportFailure(error), false);
});

test("recognizes retryable proxy transport failures", () => {
  assert.equal(isTransportFailure(new Error("Proxy error: connection refused")), true);
  assert.equal(isTransportFailure(new Error("HTTP Error 503: Service Unavailable")), true);
  assert.equal(isYouTubeChallenge(new Error("HTTP Error 503: Service Unavailable")), false);
});

test("recognizes retryable media-CDN failures without confusing authentication", () => {
  assert.equal(isProxyMediaFailure(new Error("ERROR: unable to download video data: HTTP Error 403: Forbidden")), true);
  assert.equal(isProxyMediaFailure(new Error("HTTP Error 429: Too Many Requests")), true);
  assert.equal(isProxyMediaFailure(new Error("Sign in to confirm you’re not a bot")), false);
});

test("keeps one proxy route half-open when the entire pool is cooling down", () => {
  const routes = ["proxy-a", "proxy-b", "proxy-c"];
  const cooldowns = new Map([
    ["proxy-a", 3_000],
    ["proxy-b", 2_000],
    ["proxy-c", 4_000],
  ]);
  assert.deepEqual(orderedProxyRoutes(routes, cooldowns, 1_000, 0), ["proxy-b"]);
});

test("rotates across healthy routes and skips cooling routes", () => {
  const routes = ["proxy-a", "proxy-b", "proxy-c"];
  const cooldowns = new Map([["proxy-b", 2_000]]);
  assert.deepEqual(orderedProxyRoutes(routes, cooldowns, 1_000, 1), ["proxy-c", "proxy-a"]);
});
