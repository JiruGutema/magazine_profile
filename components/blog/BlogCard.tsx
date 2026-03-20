"use client";

import Link from "next/link";
import { Calendar, Clock, ThumbsUpIcon, ThumbsDown, User } from "lucide-react";
import { generateSlug } from "@/lib/utils";
import { BlogPost } from "@/lib/types";

interface BlogCardProps {
  post: BlogPost;

}

export default function BlogCard({ post}: BlogCardProps) {
  const slug = generateSlug(post.title);

  return (
    <Link href={`/blogs/${slug}`} className=" group flex flex-row items-start space-x-6 bg-card p-2 hover:bg-card-hover transition-colors">
      <article className="rounded-lg mb-2 flex flex-row justify-between hover:border-s-card-foreground transition-shadow duration-200">
        <div className="space-y-4">
          {/* Header */}
          <div className="space-y-2">
            <Link href={`/blogs/${slug}`} className="block group">
              <h2 className="text-xl font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
                {post.title}
              </h2>
            </Link>

            <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
          </div>

          {/* Meta information */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-4">
              {/* <div className="flex items-center space-x-1"> */}
              {/*   <User className="w-4 h-4" /> */}
              {/*   <span>{post.author}</span> */}
              {/* </div> */}

              <div className="flex items-center space-x-1">
                <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
              </div>

              <div className="flex items-center space-x-1">
                <span>{post.readTime.toString()}</span>
              </div>
            </div>

            {/* Reactions preview */}
            {/* <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <ThumbsUpIcon className="w-4 h-4 text-gray-500" />
              <span>{post.likes}</span>
            </div>
            <div className="flex items-center space-x-1">
              <ThumbsDown className="w-4 h-4 text-gray-500" />
              <span>{post.dislikes}</span>
            </div>
          {/* </div> */}
          </div>

          {/* Read more link */}
          {/* <div className="pt-2"> */}
          {/*   <Link */}
          {/*     href={`/blogs/${slug}`} */}
          {/*     className="inline-flex items-center text-primary hover:text-primary/80 font-medium transition-colors" */}
          {/*   > */}
          {/*     Read more → */}
          {/*   </Link> */}
          {/* </div> */}
        </div>

        {/* <div className=" h-48 overflow-hidden rounded-md"> */}
        {/*   <img */}
        {/*     src={post.coverImage} */}
        {/*     alt={post.title} */}
        {/*     className="w-200 h-full object-cover" */}
        {/*   /> */}
        {/* </div> */}
      </article>
    </Link>
  );
}
