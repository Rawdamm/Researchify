import { useState } from "react";
import {FaThumbsUp, FaThumbsDown, FaCopy, FaCheck, FaReply} from "react-icons/fa";

export default function SourceCard({ platform, title, confidence, link, time }) {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [copied, setCopied] = useState(false);

  const getMatch = () => {
    const value = parseInt(confidence);
    if (value >= 85) return { label: "Strong Match", color: "bg-orange-500/15 text-orange-300 border border-orange-500/30" };
    if (value >= 70) return { label: "Relevant",      color: "bg-white/8 text-slate-300 border border-white/15" };
    return               { label: "Weak Match",       color: "bg-white/5 text-slate-400 border border-white/10" };
  };

  const getBarColor = () => {
    const value = parseInt(confidence);
    if (value >= 85) return "bg-orange-500";
    if (value >= 70) return "bg-slate-400";
    return "bg-slate-600";
  };

  const match = getMatch();
  const barColor = getBarColor();

  return (
    <article
      className="relative rounded-2xl px-6 py-0 md:p-7 overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* Left accent bar */}
      <div
        className="absolute top-0 left-0 h-full w-1"
        style={{
          background: "linear-gradient(to bottom, #fb923c, #94a3b8, transparent)",
        }}
      />

      <div className="flex items-center gap-3 mb-4">
        <div
          className="inline-block text-xs px-3 py-1 rounded-full text-orange-300 font-medium"
          style={{ background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.25)" }}
        >
          {platform}
        </div>

        <div className={`text-xs px-3 py-1 rounded-full ${match.color}`}>
          {match.label}
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-3 line-clamp-2 text-white">
        {title}
      </h3>

      <p className="text-sm text-slate-400 leading-6 mb-6">
        Research result collected from {platform}.
        This source contains information related to
        your query and contributes to the generated summary.
      </p>

      <div className="mb-5">
        <div className="flex justify-between text-xs mb-2">
          <span className="text-slate-500">Source Strength</span>
          <span className={parseInt(confidence) >= 85 ? "text-orange-400" : "text-slate-400"}>
            {confidence}
          </span>
        </div>

        <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
          <div style={{ width: confidence }} className={`h-full rounded-full ${barColor}`} />
        </div>
      </div>

      <div className="pt-4 flex justify-between items-center" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          className="text-sm font-medium text-orange-400 hover:text-orange-300 transition-colors"
        >
          Open Source →
        </a>

        <div className="flex items-center gap-4 text-slate-500">
          <button
            onClick={() => { setLiked(!liked); if (!liked) setDisliked(false); }}
            className="hover:text-orange-400 transition-colors"
          >
            <FaThumbsUp className={liked ? "text-orange-400" : ""} />
          </button>

          <button
            onClick={() => { setDisliked(!disliked); if (!disliked) setLiked(false); }}
            className="hover:text-slate-300 transition-colors"
          >
            <FaThumbsDown className={disliked ? "text-slate-300" : ""} />
          </button>

          <button
            onClick={() => {
              navigator.clipboard.writeText(title);
              setCopied(true);
              setTimeout(() => setCopied(false), 2500);
            }}
            className="hover:text-orange-400 transition-colors"
          >
            {copied ? <FaCheck className="text-orange-400" /> : <FaCopy />}
          </button>

          <button className="hover:text-slate-300 transition-colors">
            <FaReply />
          </button>
        </div>
      </div>
    </article>
  );
}
