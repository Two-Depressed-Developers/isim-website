"use client";

import HeroSlider from "./sections/HeroSlider";
import { HomepageData, HomepageSection } from "@/types/strapi";
import SupervisorsSection from "./sections/supervisors/SupervisorsSection";
import CollaborationsSection from "./sections/collaborations/CollaborationsSection";
import StudentGroupsSection from "./sections/student-groups/StudentGroupsSection";
import CollectionFeedSection from "./sections/collection-feed/CollectionFeedSection";
import { cn } from "@/lib/utils";

type Props = {
  homepage: HomepageData;
};

export default function HomepageBuilder({ homepage }: Props) {
  const getComponentByType = (section: HomepageSection) => {
    switch (section.__component) {
      case "homepage.hero-slider":
        return <HeroSlider data={section} />;
      case "homepage.supervisors":
        return <SupervisorsSection data={section} />;
      case "homepage.collaborations":
        return <CollaborationsSection data={section} />;
      case "homepage.student-groups":
        return <StudentGroupsSection data={section} />;
      case "homepage.collection-feed":
        return <CollectionFeedSection data={section} />;
      default:
        return null;
    }
  };

  return (
    <div className="mb-8 flex flex-col gap-y-20">
      {homepage.sections.map((section, index) => {
        const isHeroFirst =
          index === 0 && section.__component === "homepage.hero-slider";
        return (
          <div
            key={section.id}
            className={cn(
              "mx-auto w-full",
              isHeroFirst ? "max-w-fhd" : "max-w-7xl px-6 py-4",
            )}
          >
            {getComponentByType(section)}
          </div>
        );
      })}
    </div>
  );
}
