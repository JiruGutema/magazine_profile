"use client";

export default function SocialLinks() {
  return (
    <div className="flex gap-x-2 mt-4">
      <div className=" flex text-sky-700 font-bold items-center  flex-wrap gap-x-3 rounded-md py-2 text-sm border-1 border-primary ">
        <a
          href="https://www.github.com/jirugutema"
          target="_blank"
          rel="noopener noreferrer"
          title="GitHub"
          
        >
         Github
        </a>{" "}
        <a
          href="https://www.leetcode.com/jiru_gutema"
          target="_blank"
          rel="noopener noreferrer"
          title="LeetCode"
        >
          Leetcode
        </a>

        <a
          href="https://www.linkedin.com/in/jiru-gutema"
          target="_blank"
          rel="noopener noreferrer"
          title="LinkedIn"
        >
         Linkedin
        </a>
   
        <a
          href="https://www.x.com/jirugutema"
          target="_blank"
          rel="noopener noreferrer"
          title="X (twitter) "
        >
          X
        </a>
        <a
          href="mailto:jirudagutema@gmail.com"
          target="_blank"
          rel="noopener noreferrer"
          title="Email"
        >
         Gmail
        </a>
      </div>
    </div>
  );
}
