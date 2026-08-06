"use client";

import { useState, useEffect, useRef } from "react";
import {
  getOrCreateVisitorId,
  getBrowserFingerprint,
} from "@/lib/client-fingerprint";

interface BlogReactionsProps {
  postId: string;
  initialLikes: number;
  initialDislikes: number;
}

export default function BlogReactions({
  postId,
  initialLikes,
  initialDislikes,
}: BlogReactionsProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [userReaction, setUserReaction] = useState<"like" | "dislike" | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const visitorIdRef = useRef<string>("");
  const fingerprintRef = useRef<string>("");
  const messageTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showFeedback = (msg: string) => {
    if (messageTimeoutRef.current) {
      clearTimeout(messageTimeoutRef.current);
    }
    setFeedbackMessage(msg);
    messageTimeoutRef.current = setTimeout(() => {
      setFeedbackMessage(null);
    }, 4000);
  };

  useEffect(() => {
    setMounted(true);
    const vid = getOrCreateVisitorId();
    visitorIdRef.current = vid;

    // Load initial local preference
    const saved = localStorage.getItem(`blog-reaction-${postId}`);
    if (saved === "like" || saved === "dislike") {
      setUserReaction(saved);
    }

    // Retrieve fingerprint and verify authoritative state from server
    getBrowserFingerprint().then((fp) => {
      fingerprintRef.current = fp;

      fetch(
        `/api/blogs/reaction?postId=${encodeURIComponent(postId)}&userId=${encodeURIComponent(vid)}&fingerprint=${encodeURIComponent(fp)}`,
      )
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && data.success) {
            if (typeof data.likes === "number") setLikes(data.likes);
            if (typeof data.dislikes === "number") setDislikes(data.dislikes);
            if (data.userReaction !== undefined) {
              setUserReaction(data.userReaction);
              if (data.userReaction) {
                localStorage.setItem(`blog-reaction-${postId}`, data.userReaction);
              } else {
                localStorage.removeItem(`blog-reaction-${postId}`);
              }
            }
          }
        })
        .catch(() => {
          // Silent fallback to local storage
        });
    });

    return () => {
      if (messageTimeoutRef.current) {
        clearTimeout(messageTimeoutRef.current);
      }
    };
  }, [postId]);

  const handleReaction = async (type: "like" | "dislike") => {
    if (isLoading || !mounted) return;

    setIsLoading(true);
    setFeedbackMessage(null);

    const prevLikes = likes;
    const prevDislikes = dislikes;
    const prevReaction = userReaction;

    let action:
      | "like"
      | "dislike"
      | "unlike"
      | "undislike"
      | "switch_to_like"
      | "switch_to_dislike";
    let newLikes = likes;
    let newDislikes = dislikes;
    let newUserReaction: "like" | "dislike" | null = null;

    if (userReaction === type) {
      if (type === "like") {
        action = "unlike";
        newLikes = Math.max(0, likes - 1);
      } else {
        action = "undislike";
        newDislikes = Math.max(0, dislikes - 1);
      }
      newUserReaction = null;
    } else {
      if (userReaction === "like") {
        action = "switch_to_dislike";
        newLikes = Math.max(0, likes - 1);
        newDislikes = dislikes + 1;
      } else if (userReaction === "dislike") {
        action = "switch_to_like";
        newDislikes = Math.max(0, dislikes - 1);
        newLikes = likes + 1;
      } else {
        if (type === "like") {
          action = "like";
          newLikes = likes + 1;
        } else {
          action = "dislike";
          newDislikes = dislikes + 1;
        }
      }
      newUserReaction = type;
    }

    // Optimistic UI update
    setLikes(newLikes);
    setDislikes(newDislikes);
    setUserReaction(newUserReaction);

    if (newUserReaction) {
      localStorage.setItem(`blog-reaction-${postId}`, newUserReaction);
    } else {
      localStorage.removeItem(`blog-reaction-${postId}`);
    }

    try {
      const vid = visitorIdRef.current || getOrCreateVisitorId();
      const fp = fingerprintRef.current || (await getBrowserFingerprint());

      const res = await fetch("/api/blogs/reaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": vid,
          "X-Client-Fingerprint": fp,
        },
        body: JSON.stringify({
          postId: parseInt(postId, 10),
          action,
          userId: vid,
          fingerprint: fp,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (res.status === 429) {
          showFeedback(
            data.error || "Rate limit reached. Please wait a moment before trying again.",
          );
        } else {
          showFeedback(data.error || "Could not update reaction. Please try again.");
        }
        throw new Error(data.error || `HTTP ${res.status}`);
      }

      if (data.success) {
        if (typeof data.likes === "number") setLikes(data.likes);
        if (typeof data.dislikes === "number") setDislikes(data.dislikes);
        if (data.userReaction !== undefined) {
          setUserReaction(data.userReaction);
          if (data.userReaction) {
            localStorage.setItem(`blog-reaction-${postId}`, data.userReaction);
          } else {
            localStorage.removeItem(`blog-reaction-${postId}`);
          }
        }
      }
    } catch (error) {
      console.error("Reaction request failed:", error);
      // Rollback on error
      setLikes(prevLikes);
      setDislikes(prevDislikes);
      setUserReaction(prevReaction);
      if (prevReaction) {
        localStorage.setItem(`blog-reaction-${postId}`, prevReaction);
      } else {
        localStorage.removeItem(`blog-reaction-${postId}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="reactions-box">
      <p>
        <i>Did you find this helpful?</i>
      </p>
      <div className="reactions-row">
        <button
          type="button"
          onClick={() => handleReaction("like")}
          disabled={isLoading || !mounted}
          className={`reaction-btn${userReaction === "like" ? " active" : ""}`}
          aria-pressed={userReaction === "like"}
          title={userReaction === "like" ? "Remove helpful reaction" : "Mark as helpful"}
        >
          <span aria-hidden>▲</span> Helpful ({likes})
        </button>
        <button
          type="button"
          onClick={() => handleReaction("dislike")}
          disabled={isLoading || !mounted}
          className={`reaction-btn${userReaction === "dislike" ? " active" : ""}`}
          aria-pressed={userReaction === "dislike"}
          title={userReaction === "dislike" ? "Remove unhelpful reaction" : "Mark as unhelpful"}
        >
          <span aria-hidden>▼</span> Not helpful ({dislikes})
        </button>
      </div>
      {feedbackMessage && (
        <div
          role="alert"
          style={{
            marginTop: "8px",
            fontSize: "0.85rem",
            color: "#d9534f",
            background: "rgba(217, 83, 79, 0.08)",
            padding: "4px 8px",
            borderRadius: "4px",
            display: "inline-block",
            transition: "all 0.2s ease-in-out",
          }}
        >
          {feedbackMessage}
        </div>
      )}
    </div>
  );
}
