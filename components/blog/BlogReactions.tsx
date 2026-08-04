"use client";

import { useState, useEffect } from "react";

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

  useEffect(() => {
    setMounted(true);
    const savedReaction = localStorage.getItem(`blog-reaction-${postId}`);
    if (savedReaction === "like" || savedReaction === "dislike") {
      setUserReaction(savedReaction);
    }
  }, [postId]);

  const handleReaction = async (type: "like" | "dislike") => {
    if (isLoading) return;

    setIsLoading(true);

    const prevLikes = likes;
    const prevDislikes = dislikes;
    const prevReaction = userReaction;

    let action: "like" | "dislike" | "unlike" | "undislike" | "switch_to_like" | "switch_to_dislike";
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

    // Optimistic update
    setLikes(newLikes);
    setDislikes(newDislikes);
    setUserReaction(newUserReaction);

    if (newUserReaction) {
      localStorage.setItem(`blog-reaction-${postId}`, newUserReaction);
    } else {
      localStorage.removeItem(`blog-reaction-${postId}`);
    }

    try {
      const res = await fetch("/api/blogs/reaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, action }),
      });

      if (!res.ok) {
        throw new Error(`Failed reaction request: ${res.status}`);
      }

      const data = await res.json();
      if (typeof data.likes === "number") setLikes(data.likes);
      if (typeof data.dislikes === "number") setDislikes(data.dislikes);
    } catch (error) {
      console.error("Failed to persist reaction:", error);
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
        >
          <span aria-hidden>{"▲"}</span> Helpful ({likes})
        </button>
        <button
          type="button"
          onClick={() => handleReaction("dislike")}
          disabled={isLoading || !mounted}
          className={`reaction-btn${userReaction === "dislike" ? " active" : ""}`}
          aria-pressed={userReaction === "dislike"}
        >
          <span aria-hidden>{"▼"}</span> Not helpful ({dislikes})
        </button>
      </div>
    </div>
  );
}
