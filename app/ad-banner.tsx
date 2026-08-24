"use client";

import { useEffect, useRef, useState } from "react";

export const AD_KEYS = {
  leaderboard: "5321f0adf5a727cf9500e1e0bce95ca9",
  compact: "4ed5c4bd0900ef9380332764b589781a",
} as const;

export default function AdBanner({ adKey, width, height, label }: { adKey: string; width: number; height: number; label: string }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const resize = () => setScale(Math.min(1, viewport.clientWidth / width));
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [width]);

  const source = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=${width},initial-scale=1"><style>html,body{margin:0;padding:0;width:${width}px;height:${height}px;overflow:hidden;background:transparent}</style></head><body><script>atOptions=${JSON.stringify({ key: adKey, format: "iframe", height, width, params: {} })};</script><script src="https://www.highperformanceformat.com/${adKey}/invoke.js"></script></body></html>`;

  return (
    <aside className="ad-unit" style={{ maxWidth: width }} aria-label={label}>
      <span>{label}</span>
      <div ref={viewportRef} className="ad-viewport" style={{ height: height * scale }}>
        <iframe
          title={`${label} ${width} × ${height}`}
          srcDoc={source}
          width={width}
          height={height}
          loading="lazy"
          referrerPolicy="origin"
          sandbox="allow-same-origin allow-scripts allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation"
          style={{ transform: `scale(${scale})` }}
        />
      </div>
    </aside>
  );
}
