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

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      let newLikes = likes;
      let newDislikes = dislikes;
      let newUserReaction: "like" | "dislike" | null = null;

      if (userReaction === type) {
        if (type === "like") {
          newLikes = likes - 1;
        } else {
          newDislikes = dislikes - 1;
        }
        newUserReaction = null;
      } else {
        if (userReaction === "like") {
          newLikes = likes - 1;
        } else if (userReaction === "dislike") {
          newDislikes = dislikes - 1;
        }

        if (type === "like") {
          newLikes = newLikes + 1;
        } else {
          newDislikes = newDislikes + 1;
        }
        newUserReaction = type;
      }

      setLikes(newLikes);
      setDislikes(newDislikes);
      setUserReaction(newUserReaction);

      if (newUserReaction) {
        localStorage.setItem(`blog-reaction-${postId}`, newUserReaction);
      } else {
        localStorage.removeItem(`blog-reaction-${postId}`);
      }
    } catch (error) {
      console.error("Failed to update reaction:", error);
      setLikes(likes);
      setDislikes(dislikes);
      setUserReaction(userReaction);
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
