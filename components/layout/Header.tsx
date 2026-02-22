"use client";
import { Github, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const popupRef = useRef<HTMLDivElement | null>(null);
  const [isDark, setIsDark] = useState(false);

  // Load saved theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    if (newDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  useEffect(() => {
    if (!menuOpen) return;

    const closeOnScroll = () => setMenuOpen(false);

    window.addEventListener("scroll", closeOnScroll);
    return () => window.removeEventListener("scroll", closeOnScroll);
  }, [menuOpen]);
  useEffect(() => {
    if (!menuOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <header className="py-4 border-b border-border mb-8">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 flex justify-between items-center">
        <a
          href="https://github.com/JiruGutema"
          target="_blank"
          rel="noopener
          noreferrer"
        >
          <Github
            className="cursor-pointer w-8 h-7 text-foreground hover:scale-125 hover:text-foreground"
            size={20}
          />
          <span className="sr-only">GitHub</span>
        </a>
        {/* Desktop nav */}
        <nav className="hidden md:flex space-x-6 justify-center items-center">
          <Link
            href="/"
            className={`text-lg  hover:underline ${pathname === "/" ? "underline font-medium" : ""}`}
          >
            Home
          </Link>

          <Link
            href="/blogs"
            className={`text-lg  hover:underline ${pathname.includes("blogs") ? "underline font-medium" : ""}`}
          >
            Blogs
          </Link>
          <Link
            href="/projects"
            className={`text-lg  hover:underline ${pathname === "/projects" ? "underline font-medium" : ""}`}
          >
            Projects
          </Link>
          <button
            onClick={toggleTheme}
            className="ml-4 w-10 h-10 flex mt-1 text-xl items-center "
            aria-label="Toggle dark mode"
          >
            {isDark ? (
              // Sun icon
              <Sun />
            ) : (
              <Moon fill="dark" />
            )}
          </button>
        </nav>

        {/* Dark mode toggle */}

        {/* Mobile menu toggle */}
        <button
          className="md:hidden flex items-center px-3 py-2 w-16 h-10 rounded-lg text-4xl"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <nav
          ref={popupRef}
          className="md:hidden bg-background blur(100px) backdrop-blur-sm z-10 m-0 border-border px-4 py-2 flex flex-col w-full items-end absolute"
        >
          <Link
            href="/"
            className="block py-2 pr-6 text-lg font-normal hover:underline"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>

          <Link
            href="/blogs"
            className="block py-2 pr-6 text-lg font-normal hover:underline"
            onClick={() => setMenuOpen(false)}
          >
            Blogs
          </Link>

          <Link
            href="/projects"
            className="block py-2 pr-6 text-lg font-normal hover:underline"
            onClick={() => setMenuOpen(false)}
          >
            Projects
          </Link>

          <button
            onClick={toggleTheme}
            className="ml-4 w-10 h-10 flex mr-2 text-xl"
            aria-label="Toggle dark mode"
          >
            {isDark ? (
              // Sun icon
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="5"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="currentColor"
                />
                <g stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </g>
              </svg>
            ) : (
              // Moon icon
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke="currentColor"
                  strokeWidth="2"
                  d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"
                  fill="currentColor"
                />
              </svg>
            )}
          </button>
        </nav>
      )}
    </header>
  );
}
