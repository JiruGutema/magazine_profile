import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Mail, Github, Linkedin, Globe, Code, X } from "lucide-react" // Added Globe and Code icons

export default function PortfolioPage() {
  return (
    <div className="grid gap-8 py-4">
      <section className="text-center border-b border-border pb-6 mb-6">
        <h1 className="text-4xl md:text-5xl font-bold font-serif leading-tight mb-2">
        Software Engineer | Fullstack Developer
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          A detailed look into the academic journey, technical prowess, and project portfolio of an aspiring software
          engineer.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Last updated on July 15, 2025
        </p>
      </section>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <Card className="border border-border rounded-none shadow-none">
            <CardContent className="p-6 text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <Image
                  src="/images/small_profile.jpg"
                  alt="Jiru Gutema Profile"
                  layout="fill"
                  objectFit="cover"
                  className="rounded-full border-2 border-border"
                />
              </div>
              <h2 className="text-3xl font-bold font-serif mb-1">Jiru Gutema</h2>
              <p className="text-lg text-muted-foreground">Software Engineer | Fullstack Developer</p>
              <p className="text-sm text-muted-foreground">Addis Ababa, Ethiopia</p>
              <div className="flex justify-center gap-4 mt-4">
                <Link href="mailto:jirudagutema@gmail.com" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="icon" className="rounded-full border-border bg-transparent">
                    <Mail className="h-5 w-5" />
                    <span className="sr-only">Email</span>
                  </Button>
                </Link>
                <Link href="https://github.com/JiruGutema" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="icon" className="rounded-full border-border bg-transparent">
                    <Github className="h-5 w-5" />
                    <span className="sr-only">GitHub</span>
                  </Button>
                </Link>
                <Link href="https://linkedin.com/in/jirugutema" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="icon" className="rounded-full border-border bg-transparent">
                    <Linkedin className="h-5 w-5" />
                    <span className="sr-only">LinkedIn</span>
                  </Button>
                </Link>
                <Link href="https://leetcode.com/jiru_gutema" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="icon" className="rounded-full border-border bg-transparent">
                    <Code className="h-5 w-5" />
                    <span className="sr-only">Leetcode</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border rounded-none shadow-none">
            <CardHeader>
              <CardTitle className="text-2xl font-bold font-serif">Skills</CardTitle>
            </CardHeader>
            <CardContent className="">
              <h3 className="text-lg font-semibold">Programming Languages:</h3>
              <p className="text-base mt-0">JavaScript, Python, Java</p>
              <h3 className="text-lg mt-3 font-semibold">Frameworks & Libraries:</h3>
              <p className="text-base">React, Next.js, Node.js, Express, Flutter, NestJS, Tailwindcss</p>
              <h3 className="text-lg mt-3 font-semibold">Databases:</h3>
              <p className="text-base">Postgres, MySQL, MongoDB</p>
              <h3 className="text-lg mt-3 font-semibold">Tools & Platforms:</h3>
              <p className="text-base">Git, Linux (advanced), Docker, Prisma, Neon, Github Projects, Figma, Vercel, Onrender, Netlify, Cloudinary</p>
              <h3 className="text-lg mt-3 font-semibold">Concepts:</h3>
              <p className="text-base">
                AI/ML, Data Structures and Algorithms (DSA), Object Oriented Programming, Cryptography
              </p>
            </CardContent>
          </Card>

          <Card className="border border-border rounded-none shadow-none">
            <CardHeader>
              <CardTitle className="text-2xl font-bold font-serif">Languages</CardTitle>
            </CardHeader>
            <CardContent >
              <p className="text-base">English (Fluent)</p>
              <p className="text-base">Afaan Oromoo (Native)</p>
              <p className="text-base">Amharic (Fluent)</p>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-8">
           <section>
            <h2 className="text-3xl font-bold font-serif border-b border-border pb-2 mb-4">About Me</h2>
            <p className="text-base leading-relaxed">
              As a passionate software engineering student, I am constantly seeking opportunities to expand my knowledge
              and apply my skills to real-world problems. My academic journey has provided me with a strong foundation
              in data structures, algorithms, and software design principles. I thrive in collaborative environments and
              am always eager to learn from experienced professionals.
            </p>
            <p className="text-base leading-relaxed mt-4">
              My interests lie in <strong>full-stack development</strong>, <strong>machine learning</strong>, and <strong>cloud computing</strong>. I believe in writing
              clean, efficient, and maintainable code, and I am committed to continuous improvement. Outside of coding,
              I enjoy exploring new technologies, listening to educational and science videos (<Link href="https://www.youtube.com/c/veritasium"  style={{ color: "blue", textDecoration: "underline" }}   target="_blank" rel="noopener noreferrer">Veritasium</Link>,<Link href="https://www.youtube.com/c/vsauce"  style={{ color: "blue", textDecoration: "underline" }}   target="_blank" rel="noopener noreferrer">Vsauce</Link>,<Link href="https://www.youtube.com/c/numberphile"  style={{ color: "blue", textDecoration: "underline" }}   target="_blank" rel="noopener noreferrer">Numberphile</Link>,<Link href="https://www.youtube.com/c/3blue1brown"  style={{ color: "blue", textDecoration: "underline" }}   target="_blank" rel="noopener noreferrer">3Blue1Brown</Link>), and contributing to open-source projects.
            </p>
          </section>
    
          <Separator className="bg-border" />

          <section>
            <h2 className="text-3xl font-bold font-serif border-b border-border pb-2 mb-4">Education</h2>
            <div className="space-y-4">
              <article>
                <h3 className="text-xl font-semibold font-serif">BSc in Software Engineering</h3>
                <p className="text-base italic text-muted-foreground">Addis Ababa University | 01/2023 – 09/2027</p>
                <p className="text-base italic text-muted-foreground">Addis Ababa, Ethiopia</p>
                <ul className="list-disc list-inside text-base mt-2">
                  <li>
                    <strong className="italic">Coursework: </strong>Web Development, Mobile Application (Flutter), Fundamental of Software Engineering, Data Structures and Algorithms, Operating System, Computer Architecture, Object
                    Oriented Programming, Software Development, .
                  </li>
                </ul>
              </article>
              <article>
                <h3 className="text-xl font-semibold font-serif">Coding Academy (backed by Google)</h3>
                <p className="text-base italic text-muted-foreground">African to Silicon Valley | 01/2025 – 01/2026</p>
                <p className="text-base italic text-muted-foreground">Addis Ababa, Ethiopia</p>
                <ul className="list-disc list-inside text-base mt-2">
                  <li>
                    <strong className="italic">Coursework: </strong>Advanced Data structures and Algorithms (Graph and Tree Algorithms, Dynamic
                    Programming, Advanced String Algorithms).
                  </li>
                </ul>
              </article>
              <article>
                <h3 className="text-xl font-semibold font-serif">Introduction to Cyber Security and Cryptography</h3>
                <p className="text-base italic text-muted-foreground">INSA Summer Program | 11/2024 – 01/2025</p>
                <p className="text-base italic text-muted-foreground">Addis Ababa, Ethiopia</p>
                <ul className="list-disc list-inside text-base mt-2">
                  <li>
                    <strong className="italic">Courses:</strong> Introduction to Cyber Security and Ethical Hacking, Introduction to Cryptography.
                  </li>
                </ul>
              </article>
            </div>
          </section>
          <section>
            <h2 className="text-3xl font-bold font-serif border-b border-border pb-2 mb-4">Experience</h2>
            <div className="space-y-4">
              <article>
                <h3 className="text-xl font-semibold font-serif">Backend Developer @Gulit</h3>
                <p className="text-base text-muted-foreground">Gulit | 05/2025 – Present</p>
                <p className="text-base text-muted-foreground">Addis Ababa, Ethiopia</p>
                <ul className="list-disc list-inside text-base mt-2">
                  <li>
                   Currently, I am working as a Express backend developer for Gulit, where I am Implementing and maintaining the backend for their eCommerce platform.
                  </li>
                </ul>
              </article>
              <article>
                <h3 className="text-xl font-semibold font-serif">Fullstack Developer @BewideTechnologies</h3>
                <p className="text-base text-muted-foreground">Bewide Technologies | 07/2025 – Present</p>
                <p className="text-base text-muted-foreground">Addis Ababa, Ethiopia</p>
                <ul className="list-disc list-inside text-base mt-2">
                  <li>
                    I am Currently, a Fullstack Developer Intern at Bewide Teachnologies, where I am working on a full stack eCommerce Application for client. I am Implementing it using a Nextjs as a Full stack Framwework
                  </li>
                </ul>
              </article>
              <article>
                <h3 className="text-xl font-semibold font-serif">FullStack Developer Freelance EasyEnjaz</h3>
                <p className="text-base text-muted-foreground">EasyEnjaz | 02/2025 – 05/2025</p>
                <p className="text-base text-muted-foreground">Addis Ababa, Ethiopia</p>
                <ul className="list-disc list-inside text-base mt-2">
                  <li>
                    Completed a Client full stack web application built with Expressjs and Reactjs. The application is capable of managing a visa applicants, printing summery and report, easy application process for all applicants.
                  </li>
                </ul>
              </article>
              <article>
                <h3 className="text-xl font-semibold font-serif">Backend Developer Intern @Ethioware</h3>
                <p className="text-base text-muted-foreground">Ethioware | 02/2025 – 05/2025</p>
                <p className="text-base text-muted-foreground">Addis Ababa, Ethiopia</p>
                <ul className="list-disc list-inside text-base mt-2">
                  <li>
                    Completed a short-term backend development internship, working with Node.js and Express to build and
                    improve server-side applications.
                  </li>
                </ul>
              </article>
            </div>
          </section>

          <Separator className="bg-border" />

          <section>
            <h2 className="text-3xl font-bold font-serif border-b border-border pb-2 mb-4">Projects</h2>
            <div className="grid gap-6" style={{height: "600px", overflowY: "scroll"}}>
              <Card className="border border-border rounded-none shadow-none">
                <CardHeader>
                  <CardTitle className="text-xl font-bold font-serif">Hide Youtube Shorts (Firefox Extension)</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base text-muted-foreground mb-2">
                    A Firefox extension to hide YouTube Shorts, allowing users to overcome endless looping of shorts scrolling.
                  </p>
                  <Link href="/projects#project-1"  className="text-black bg-white border border-black hover:underline p-2 text-sm mt-2 inline-block">
                    View Project
                  </Link>
                </CardContent>
              </Card>
              <Card className="border border-border rounded-none shadow-none">
                <CardHeader>
                  <CardTitle className="text-xl font-bold font-serif">JirenIntelli (Personal)</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base text-muted-foreground mb-2">
                    A mini chatbot built using a Gemini free flash API, designed to assist users with basic tasks,
                    coding, and writing paragraphs.
                  </p>
                  <Link href="#"  className="text-black border bg-white border-black hover:underline p-2 text-sm mt-2 inline-block">
                    View Project
                  </Link>
                </CardContent>
              </Card>
              <Card className="border border-border rounded-none shadow-none">
                <CardHeader>
                  <CardTitle className="text-xl font-bold font-serif">
                    House Rental Web Application (Group Project)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base text-muted-foreground mb-2">
                    A full-stack web application for a house rental platform, built with Node.js, Express, MySQL, React,
                    and JWT.
                  </p>
                  <Link href="#"  className="text-black hover:underline p-2 border border-black bg-white text-sm mt-2 inline-block">
                    View Project
                  </Link>
                </CardContent>
              </Card>
              <Card className="border border-border rounded-none shadow-none">
                <CardHeader>
                  <CardTitle className="text-xl font-bold font-serif">
                    Restaurant Management System (Group Project)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base text-muted-foreground mb-2">
                    A full-stack restaurant management system built with Node.js, NestJS, TypeScript, and vanilla HTML.
                    Contributed as a database designer, frontend developer, and API integrator.
                  </p>
                  <Link href="#"  className="text-black bg-white border border-black hover:underline p-2 text-sm mt-2 inline-block">
                    View Project
                  </Link>
                </CardContent>
              </Card>
              <Card className="border border-border rounded-none shadow-none">
                <CardHeader>
                  <CardTitle className="text-xl font-bold font-serif">VolunteerConnect (Group Project)</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base text-muted-foreground mb-2">
                    Contributed as a backend and Flutter developer to the VolunteerConnect app, implementing features
                    using Express, MySQL, Flutter, JWT, and Firebase.
                  </p>
                  <Link href="#"  className="text-black bg-white border border-black hover:underline p-2 text-sm mt-2 inline-block">
                    View Project
                  </Link>
                </CardContent>
              </Card>
            </div>
          </section>
          <Link href="/projects"   className="text-black bg-white border border-black p-2 hover:underline text-sm mt-2 inline-block">
            View Selected Projects
          </Link>
          <Separator className="bg-border" />

          <section>
            <h2 className="text-3xl font-bold font-serif border-b border-border pb-2 mb-4">Contributions</h2>
            <div className="grid gap-6">
              <Card className="border border-border rounded-none shadow-none">
                <CardHeader>
                  <CardTitle className="text-xl font-bold font-serif">React-Next-Folder Creator</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base text-muted-foreground mb-2">
                    A Node.js library that creates folders for React and Next.js projects. Contributed by enhancing user
                    experience with commands and multi-argument support for multiple folder creation.
                  </p>
                  <Link href="#" className="text-primary hover:underline text-sm mt-2 inline-block">
                    View Contribution
                  </Link>
                </CardContent>
              </Card>
              <Card className="border border-border rounded-none shadow-none">
                <CardHeader>
                  <CardTitle className="text-xl font-bold font-serif">db4free-net-l10n</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base text-muted-foreground mb-2">
                    Contributed to the db4free.net platform (a free online database host) by adding an Afaan Oromoo
                    Translation pool.
                  </p>
                  <Link href="#" className="text-primary hover:underline text-sm mt-2 inline-block">
                    View Contribution
                  </Link>
                </CardContent>
              </Card>
            </div>
          </section>

          <Separator className="bg-border" />

          <section>
            <h2 className="text-3xl font-bold font-serif border-b border-border pb-2 mb-4">Testimonials</h2>
            <div className="grid gap-6">
              <Card className="border border-border rounded-none shadow-none">
                <CardContent className="p-6">
                  <p className="text-base italic mb-2">
                    {
                      '"To Whom It May Concern:"'
                    }</p>
                  <p className="text-base mb-4">
                    {
                      '"...As Product Manager, I had the privilege of working closely with Jiru on the Company Website Redesign project, where he served as a Backend Web Developer. Jiru quickly distinguished himself through his unique attributes. He takes initiative and suggested using React for the project. He handles project requirements carefully, delivers timely updates, and is a team player. His performance during the internship was marked by strong collaboration with peers, proficiency in the React framework, and a solid understanding of backend workflows. I am confident that Jiru Gutema will excel in any backend web development role he pursues. His initiative, careful handling of requirements, timely updates, and teamwork skills will make him a valuable asset to any team. I wholeheartedly recommend him and would welcome the opportunity to work with him again."'
                    }
                  </p>
                  <p className="text-sm font-semibold text-muted-foreground">
                    - <a href="https://www.linkedin.com/in/anteneh-yimmam0/">Anteneh Yimmam</a>, A Education Lead at Ethioware EdTech Initiative
                  </p>
                </CardContent>
              </Card>
              
            </div>
          </section>

          <Separator className="bg-border" />

          <section id="contact">
            <h2 className="text-3xl font-bold font-serif border-b border-border pb-2 mb-4">Contact Me</h2>
            <p className="text-base leading-relaxed mb-4">
              I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
              Feel free to reach out!
            </p>
            <div className="space-y-2">
              <p className="text-lg font-semibold">Email:</p>
              <Link
                href="mailto:jirudagutema@gmail.com"
                className="text-primary hover:underline text-base flex items-center gap-2"
              >
                <Mail className="h-5 w-5" /> jirudagutema@gmail.com
              </Link>
              <p className="text-lg font-semibold mt-4">Connect with me:</p>
              <div className="flex gap-4">
                <Link href="https://github.com/JiruGutema" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="icon" className="rounded-full border-border bg-transparent">
                    <Github className="h-5 w-5" />
                    <span className="sr-only">GitHub</span>
                  </Button>
                </Link>
                <Link href="https://linkedin.com/in/jirugutema" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="icon" className="rounded-full border-border bg-transparent">
                    <Linkedin className="h-5 w-5" />
                    <span className="sr-only">LinkedIn</span>
                  </Button>
                </Link>
                <Link href="https://x.com/jirugutema" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="icon" className="rounded-full border-border bg-transparent">
                    <X className="h-5 w-5" />
                    <span className="sr-only">X</span>
                  </Button>
                </Link>
              
                <Link href="https://leetcode.com/yourprofile" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="icon" className="rounded-full border-border bg-transparent">
                    <Code className="h-5 w-5" />
                    <span className="sr-only">Leetcode</span>
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
