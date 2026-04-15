import Link from "next/link";
import { Button } from "../ui/button";

export default function About() {
  return (
    <section>
      <h2 className="text-3xl font-normal font-serif  border-border pb-2 mb-4">
        About Me
      </h2>
      <p className="text-base leading-relaxed mb-2">
        I’m a passionate Software Engineering student at Addis Ababa University,
        driven by curiosity and a desire to turn ideas into impactful digital
        solutions. My academic journey has equipped me with a strong foundation
        in data structures, algorithms, and software design principles, which I
        actively apply to real-world projects and collaborations.
      </p>
      <p>
        My interests span full-stack development, machine learning, and cloud
        computing, and I take pride in writing clean, efficient, and
        maintainable code. I’m constantly exploring new technologies, learning
        from experienced developers, and contributing to open-source projects
        that challenge and inspire me.
      </p>
      <p className="text-base leading-relaxed mt-4">
        Beyond coding, I enjoy engaging with educational and science content
        from creators like (
        <Link
          href="https://www.youtube.com/c/veritasium"
          target="_blank"
          className=" text-blue-500 font-bold hover:underline"
          rel="noopener noreferrer"
        >
          Veritasium
        </Link>{" "}
        ,
        <Link
          href="https://www.youtube.com/c/startalk"
          target="_blank"
          className=" text-blue-500 font-bold hover:underline"
          rel="noopener noreferrer"
        >
          StarTalk
        </Link>{" "}
        ,
        <Link
          href="https://www.youtube.com/c/3blue1brown"
          target="_blank"
          className=" text-blue-500 font-bold hover:underline"
          rel="noopener noreferrer"
        >
          3Blue1Brown
        </Link>
        ), always seeking to expand my perspective and creativity.
      </p>
      <br />
      <span className="text-sm text-muted-foreground">

      <Link href="/resume.pdf" target="_blank" rel="noopener noreferrer">
        <Button
          variant={"outline"}
          className="rounded-sm border  border-border"
        >
          <span className="ml-2">View Resume</span>
        </Button>
      </Link>

        <i className="ml-2 fas fa-file-pdf text-zinc-500">last updated: april, 2026</i>
      </span>
    </section>
  );
}
