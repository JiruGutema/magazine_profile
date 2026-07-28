import SocialLinks from "./Social-Links";

export default function ContactMe() {
  return (
    <section id="contact">
      <h2 className="text-3xl font-normal font-serif  border-border pb-2 mb-4">
        Contact Me
      </h2>
      <p className="text-base leading-relaxed mb-4">
        I'm always open to discussing new projects, creative ideas, or
        opportunities to be part of your vision. Feel free to reach out!
      </p>
      <div className="space-y-2">
        <div className="flex gap-4">
          <SocialLinks />
        </div>
      </div>
    </section>
  );
}
