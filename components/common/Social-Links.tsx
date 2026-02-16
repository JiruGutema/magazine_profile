"use client";

import {
  Send,
  Linkedin,
  Instagram,
  Twitter,
  Github,
  Code,
  Mail,
  Code2Icon,
} from "lucide-react";

export default function SocialLinks() {
  return (
    <div className="flex gap-x-2 mt-4">
      <div className="relative flex items-center justify-center gap-x-3 rounded-md p-3 py-2 text-sm bg-card border-1 border-primary ">
        <a
          href="https://www.github.com/jirugutema"
          target="_blank"
          rel="noopener noreferrer"
          title="GitHub"
        >
          <Github className="cursor-pointer  hover:scale-125 " size={20} />
        </a>{" "}
        <a
          href="https://www.leetcode.com/jiru_gutema"
          target="_blank"
          rel="noopener noreferrer"
          title="LeetCode"
        >
          <Code2Icon className="cursor-pointer   hover:scale-125  " size={20} />
        </a>
        <a
          href="https://www.t.me/jethior"
          target="_blank"
          rel="noopener noreferrer"
          title="Telegram"
        >
          <Send className="cursor-pointer  hover:scale-125 " size={20} />
        </a>
        <a
          href="https://www.linkedin.com/in/jiru-gutema"
          target="_blank"
          rel="noopener noreferrer"
          title="LinkedIn"
        >
          <Linkedin className="cursor-pointer  hover:scale-125 " size={20} />
        </a>
        <a
          href="https://www.instagram.com/jirugutema"
          target="_blank"
          rel="noopener noreferrer"
          title="Instagram"
        >
          <Instagram className="cursor-pointer  hover:scale-125 " size={20} />
        </a>
        <a
          href="https://www.x.com/jirugutema"
          target="_blank"
          rel="noopener noreferrer"
          title="X (twitter) "
        >
          <Twitter className="cursor-pointer  hover:scale-125 " size={20} />
        </a>
        <a
          href="mailto:jirudagutema@gmail.com"
          target="_blank"
          rel="noopener noreferrer"
          title="Email"
        >
          <Mail className="cursor-pointer  hover:scale-125 " size={20} />
        </a>
      </div>
    </div>
  );
}
