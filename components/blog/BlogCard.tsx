"use client";

import Link from "next/link";
import { Calendar, Clock, ThumbsUpIcon, ThumbsDown, User } from "lucide-react";
import { generateSlug } from "@/lib/utils";
import { BlogPost } from "@/lib/types";

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  const slug = generateSlug(post.title);

  return (
    <article className="bg-card border border-border rounded-lg p-6 flex flex-row justify-between hover:shadow-lg transition-shadow duration-200">
      <div className="space-y-4">
        {/* Header */}
        <div className="space-y-2">
          <Link href={`/blogs/${slug}`} className="block group">
            <h2 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
              {post.title}
            </h2>
          </Link>

          <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded-md"
            >
              {tag}
            </span>
          ))}
        </div>

        {/*cover image */}

        {/* Meta information */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <User className="w-4 h-4" />
              <span>{post.author}</span>
            </div>

            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
            </div>

            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{post.readTime.toString()}</span>
            </div>
          </div>

          {/* Reactions preview */}
          {/* <div className="flex items-center space-x-3"> */}
          {/*   <div className="flex items-center space-x-1"> */}
          {/*     <ThumbsUpIcon className="w-4 h-4 text-gray-500" /> */}
          {/*     <span>{post.likes}</span> */}
          {/*   </div> */}
          {/*   <div className="flex items-center space-x-1"> */}
          {/*     <ThumbsDown className="w-4 h-4 text-gray-500" /> */}
          {/*     <span>{post.dislikes}</span> */}
          {/*   </div> */}
          {/* </div> */}
        </div>

        {/* Read more link */}
        <div className="pt-2">
          <Link
            href={`/blogs/${slug}`}
            className="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-colors"
          >
            Read more →
          </Link>
        </div>
      </div>

      <div className=" h-48 overflow-hidden rounded-md">
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-200 h-full object-cover"
        />
      </div>
    </article>
  );
}
