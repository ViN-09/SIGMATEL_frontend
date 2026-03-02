import { useEffect, useMemo, useState } from "react";
import { buildCandidates } from "./Helper";

export default function ImageWithFallback({ apiHost, fileName, alt }) {
  const candidates = useMemo(
    () => buildCandidates(apiHost, fileName),
    [apiHost, fileName]
  );

  const [idx, setIdx] = useState(0);

  useEffect(() => {
    setIdx(0);
  }, [fileName]);

  if (!fileName || fileName === "-" || candidates.length === 0) {
    return <span>-</span>;
  }

  const src = candidates[idx];

  return (
    <img
      src={src}
      alt={alt}
      style={{
        maxWidth: "100%",
        borderRadius: 10,
        border: "1px solid rgba(0,0,0,0.08)",
      }}
      onError={() => {
        if (idx < candidates.length - 1) {
          setIdx((prev) => prev + 1);
        }
      }}
    />
  );
}