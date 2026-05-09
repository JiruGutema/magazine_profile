import { Card, CardContent } from "../ui/card";

export default function Testimonials() {
  return (
    <section>
      <h2 className="text-3xl font-normal font-serif border-border pb-2 mb-4">
        Testimonials
      </h2>
      <div className="grid gap-6">
        <section className="italic rounded-sm shadow-none">
          <div className="">
            <p className="text-base italic mb-2">
              {'"To Whom It May Concern:"'}
            </p>
            <p className="text-base mb-4">
              {
                '"...As Product Manager, I had the privilege of working closely with Jiru on the Company Website Redesign project, where he served as a Backend Web Developer. Jiru quickly distinguished himself through his unique attributes. He takes initiative and suggested using React for the project. He handles project requirements carefully, delivers timely updates, and is a team player. His performance during the internship was marked by strong collaboration with peers, proficiency in the React framework, and a solid understanding of backend workflows. I am confident that Jiru Gutema will excel in any backend web development role he pursues. His initiative, careful handling of requirements, timely updates, and teamwork skills will make him a valuable asset to any team. I wholeheartedly recommend him and would welcome the opportunity to work with him again."'
              }
            </p>
            <p className="text-sm font-semibold text-muted-foreground">
              -{" "}
              <a
                href="https://www.linkedin.com/in/anteneh-yimmam0/"
                className="text-blue-700 underline"
              >
                Anteneh Yimmam
              </a>
              , A Education Lead at{" "}
              <a
                href="https://ethioware.org/"
                className="text-blue-700 underline"
              >
                Ethioware EdTech Initiative
              </a>
            </p>
          </div>
        </section>
      </div>
    </section>
  );
}
