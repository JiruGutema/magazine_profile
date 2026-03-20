'use client';
import { Mail, Github, Linkedin, Link2, ImageDown, ImageIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import Link from "next/link";
import SocialLinks from "../common/Social-Links";

export default function ProfileContainer() {
  return (
    <section>
      <div className="">
        <span className="flex items-center gap-x-4">
        <h2 className="text-3xl font-normal font-serif mb-1">Jiru Gutema</h2>
        <span><a href="/images/profile.png" target="_blank" rel="noopener noreferrer"><ImageIcon className="text-sky-700"/></a></span></span>
        <p className="text-lg text-muted-foreground">
          Software Engineer | Fullstack Developer
        </p>
        <p className="text-sm text-muted-foreground">Addis Ababa, Ethiopia</p>
        <div className="">

          <SocialLinks />
        </div>
      </div>
    </section>
  );
}
