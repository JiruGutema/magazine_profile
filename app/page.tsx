import { Separator } from "@/components/ui/separator";
import ContactMe from "@/components/common/Contact-Me";
import ProfileContainer from "@/components/profile/Profile-Container";
import Skill from "@/components/profile/Skill";
import Languages from "@/components/profile/Languages";
import About from "@/components/profile/About";
import Education from "@/components/profile/Education";
import Experience from "@/components/profile/Experience";
import SelectedProjects from "@/components/portfolio/Selected-Projects";
import Contribution from "@/components/portfolio/Contribution";
import PublicActivity from "@/components/portfolio/Public-Activity";
import Testimonials from "@/components/profile/Testimonials";
import SecondaryHeader from "@/components/layout/Secondary-Header";
import Image from "next/image";

export default function PortfolioPage() {
  return (
    <div className="grid gap-8 py-4 scroll-smooth">
      {/* <SecondaryHeader /> */}
      <div className="grid md:grid-cols-3 gap-8">
        {/* side bar section */}
        <div className="md:col-span-1 space-y-6 min-w-56">
          <ProfileContainer />
          <Skill />
          <Languages />
        </div>
        {/* main content section */}
        <div className="md:col-span-2 space-y-8">
          <About />
          <Separator className="bg-border" />
          <Education />
          <Separator className="bg-border" />
          <Experience />
          {/* <Separator className="bg-border" /> */}
          {/* <SelectedProjects /> */}
          <Separator className="bg-border" />
          <Contribution />
          <Separator className="bg-border" />
          <PublicActivity />
          <Separator className="bg-border" />
          <Testimonials />
          <Separator className="bg-border" />
          <ContactMe />
        </div>
      </div>
    </div>
  );
}
