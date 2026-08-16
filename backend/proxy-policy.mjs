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
