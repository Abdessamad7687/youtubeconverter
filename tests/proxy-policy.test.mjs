import assert from "node:assert/strict";
import test from "node:test";
import { isProxyMediaFailure, isTransportFailure, isYouTubeChallenge } from "../backend/proxy-policy.mjs";

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
