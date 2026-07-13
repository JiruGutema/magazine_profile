import { notFound } from "next/navigation";
import Link from "next/link";
import BlogReactions from "@/components/blog/BlogReactions";
import MarkdownRenderer from "@/components/blog/MarkdownRenderer";
import { BlogPost } from "@/lib/types";
import prisma from "@/lib/prisma";
import { Suspense } from "react";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  const res = await prisma.blogPost.findFirst({
    where: { slug: slug },
  });

  if (!res) {
    notFound();
  }

  const post: BlogPost = {
    id: res.id,
    title: res.title,
    excerpt: res.excerpt,
    content: res.content,
    author: res.author,
    publishedAt: res.publishedAt,
    readTime: res.readTime,
    tags: res.tags.split(",").map((tag) => tag.trim()),
    likes: res.likes,
    slug: res.slug,
    dislikes: res.dislikes,
    coverImage: res.coverImage || undefined,
  };
  const formattedDate = new Date(post.publishedAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <div className="firstHeading-wrap">
        <h1 className="firstHeading">
          <i>{post.title}</i>
        </h1>
      </div>
      <div className="siteSub">
        Essay by {post.author} &middot; published {formattedDate} &middot;{" "}
        {post.readTime} min read
      </div>

      <p className="hatnote">
        Main article: <Link href="/blogs">Writings by Jiru Gutema</Link>.
      </p>

      <p>
        <i>{post.excerpt}</i>
      </p>

      <Suspense fallback={<p><i>Loading content&hellip;</i></p>}>
        <MarkdownRenderer content={post.content} />
      </Suspense>

      <h2 id="reactions">
        Reader reactions      </h2>
      <Suspense fallback={<p><i>Loading reactions&hellip;</i></p>}>
        <BlogReactions
          postId={post.id.toString()}
          initialLikes={post.likes}
          initialDislikes={post.dislikes}
        />
      </Suspense>


      {post.tags.length > 0 && (
        <div className="catlinks">
          <b>Tags</b>:{" "}
          {post.tags.map((tag, i) => (
            <span key={tag}>
              <a href="#">{tag}</a>
              {i < post.tags.length - 1 && <span className="catbar">|</span>}
            </span>
          ))}
        </div>
      )}
    </>
  );
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const res = await prisma.blogPost.findFirst({
    where: { slug: slug },
  });

  if (!res) {
    notFound();
  }
  const post: BlogPost = {
    id: res.id,
    title: res.title,
    excerpt: res.excerpt,
    content: res.content,
    author: res.author,
    publishedAt: res.publishedAt,
    readTime: res.readTime,
    tags: res.tags.split(",").map((tag) => tag.trim()),
    likes: res.likes,
    slug: res.slug,
    dislikes: res.dislikes,
    coverImage: res.coverImage ? res.coverImage : undefined,
  };

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: `${post.title} | Jiru Gutema Blog`,
    description: post.excerpt,
    keywords: post.tags.join(", "),
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}
