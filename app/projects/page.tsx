import { ProjectDetailCard } from "@/components/project-detail-card"
import { Separator } from "@/components/ui/separator"
import {projects} from "./projects"

export default function ProjectsPage() {

  return (
    <div className="grid gap-8 py-4">
      <section className="text-center border-b border-border pb-6 mb-6">
        <h1 className="text-4xl md:text-5xl font-bold font-serif leading-tight mb-2">List of Selected Projects</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          A comprehensive showcase of my software engineering work, from personal applications to collaborative
          endeavors and open-source contributions.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
             Last updated on July 15, 2025
        </p>
      </section>

      <div className="grid gap-8">
        {projects.map((project, index) => (
          <div key={index}>
            <ProjectDetailCard {...project} />
            {index < projects.length - 1 && <Separator className="bg-border my-8" />}
          </div>
        ))}
      </div>
    </div>
  )
}
