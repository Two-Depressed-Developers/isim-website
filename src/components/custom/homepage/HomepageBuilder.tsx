"use client";

import HeroSlider from "./sections/hero-slider/HeroSlider";
import { HomepageData, HomepageSection } from "@/types";
import SupervisorsSection from "./sections/supervisors/SupervisorsSection";
import CollaborationsSection from "./sections/collaborations/CollaborationsSection";
import StudentGroupsSection from "./sections/student-groups/StudentGroupsSection";
import CollectionFeedSection from "./sections/collection-feed/CollectionFeedSection";
import { cn } from "@/lib/utils";
import SectionContainer from "./SectionContainer";

type Props = {
  homepage: HomepageData;
};

export default function HomepageBuilder({ homepage }: Props) {
  const getComponentByType = (
    section: HomepageSection,
    preloadImg: boolean,
  ) => {
    switch (section.__component) {
      case "homepage.supervisors":
        return <SupervisorsSection data={section} preloadImg={preloadImg} />;
      case "homepage.collaborations":
        return <CollaborationsSection data={section} preloadImg={preloadImg} />;
      case "homepage.student-groups":
        return <StudentGroupsSection data={section} preloadImg={preloadImg} />;
      case "homepage.collection-feed":
        return <CollectionFeedSection data={section} preloadImg={preloadImg} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col">
      {homepage.sections.map((section, index) => {
        if (section.__component === "homepage.hero-slider") {
          return (
            <HeroSlider
              key={`section_${index}`}
              data={section}
              preloadImg={index <= 1}
            />
          );
        }

        return (
          <SectionContainer
            key={`section_${index}`}
            className={cn(
              index % 2 === 0 ? "bg-white" : "bg-second-background",
              index !== homepage.sections.length - 1
                ? "border-gray-accent border-b"
                : "",
            )}
          >
            {getComponentByType(section, index <= 1)}
          </SectionContainer>
        );
      })}
    </div>
  );
}
