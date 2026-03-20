import Link from "next/link"
import Image from "next/image"

export function PortfolioCard() {
  return (
    <section className="border border-border rounded-none p-6">
      <header className="pb-2">
        <h2 className="text-2xl font-bold font-serif">Featured Profile: A Software Engineer Student</h2>
        <p className="text-sm text-muted-foreground">
          An in-depth look at a promising talent.
        </p>
      </header>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="relative w-full h-48 md:h-auto">
          <Image
            src="/images/profile.png"
            alt="Profile Picture"
            layout="fill"
            objectFit="cover"
            className="border border-border"
          />
        </div>
        <div className="space-y-2">
          <p className="text-base leading-relaxed">
            Meet a dedicated software engineering student with a passion for crafting innovative solutions. Discover
            their journey, skills, and projects that are shaping the future of technology.
          </p>
          <p className="text-sm text-muted-foreground italic">
            {'"The future belongs to those who learn more skills and combine them in creative ways."'}
          </p>
          <Link href="/portfolio">
            <span className="mt-4 inline-block rounded-none border border-border bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90">
              Read Full Profile
            </span>
          </Link>
        </div>
      </div>
    </section>
  )
}
