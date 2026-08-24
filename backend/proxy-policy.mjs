function errorDetails(error) {
  if (!(error instanceof Error)) return String(error);
  return `${error.message}\n${error.details || ""}`;
}

export function isYouTubeChallenge(error) {
  return /sign in to confirm|not a bot|login_required|authentication required|use --cookies/i.test(errorDetails(error));
}

export function isTransportFailure(error) {
  return /timed? out|connection (?:refused|reset|closed)|proxy error|cannot connect|tunnel connection failed|network is unreachable|temporary failure in name resolution|http error 407|http error 50[234]/i.test(errorDetails(error));
}

export function isProxyMediaFailure(error) {
  return /unable to download (?:video )?data:[^\n]*http error (?:403|429)|http error 429:|too many requests/i.test(errorDetails(error));
}

export function orderedProxyRoutes(proxies, cooldowns, now, cursor) {
  if (!proxies.length) return [];
  const available = proxies.filter((proxy) => (cooldowns.get(proxy) || 0) <= now);
  if (!available.length) {
    return [...proxies]
      .sort((left, right) => (cooldowns.get(left) || 0) - (cooldowns.get(right) || 0))
      .slice(0, 1);
  }
  const start = cursor % available.length;
  return [...available.slice(start), ...available.slice(0, start)];
}
