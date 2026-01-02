import { unstable_cache } from "next/cache";
import { getHomepage } from "../api/homepage";
import { getResearchOffers } from "../api/research-offers";
import { getGroupsData } from "../api/groups";
import { getConferences } from "../api/conferences";
import { getCourses } from "../api/courses";
import { getJournals } from "../api/journals";
import {
  CollectionLayout,
  ComponentHomepageCollectionFeed,
  HomepageData,
  HomepageSection,
} from "@/lib/types";

const REVALIDATE_TIME = 60 * 5;

const getCachedHomepage = unstable_cache(getHomepage, ["homepage"], {
  revalidate: REVALIDATE_TIME,
  tags: ["homepage"],
});

const getCachedResearchOffers = unstable_cache(
  getResearchOffers,
  ["research-offers"],
  {
    revalidate: REVALIDATE_TIME,
    tags: ["research-offers"],
  },
);

const getCachedGroups = unstable_cache(getGroupsData, ["groups"], {
  revalidate: REVALIDATE_TIME,
  tags: ["groups"],
});

const getCachedConferences = unstable_cache(getConferences, ["conferences"], {
  revalidate: REVALIDATE_TIME,
  tags: ["conferences"],
});

const getCachedCourses = unstable_cache(getCourses, ["courses"], {
  revalidate: REVALIDATE_TIME,
  tags: ["courses"],
});

const getCachedJournals = unstable_cache(getJournals, ["journals"], {
  revalidate: REVALIDATE_TIME,
  tags: ["journals"],
});

const LAYOUT_ITEM_COUNT: Record<CollectionLayout, number> = {
  row_3: 3,
  grid_2x2: 4,
  list: 5,
};

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function sortByNewest<T extends { createdAt?: string; publishedAt?: string }>(
  array: T[],
): T[] {
  return [...array].sort((a, b) => {
    const dateA = new Date(a.publishedAt || a.createdAt || 0);
    const dateB = new Date(b.publishedAt || b.createdAt || 0);
    return dateB.getTime() - dateA.getTime();
  });
}

function processItems<T>(
  items: T[],
  selectionMode: "newest" | "random" | "manual",
  itemCount: number,
): T[] {
  let processed = [...items];
  if (selectionMode === "newest") {
    processed = sortByNewest(
      processed as (T & { createdAt?: string; publishedAt?: string })[],
    ) as T[];
  } else if (selectionMode === "random") {
    processed = shuffleArray(processed);
  }
  return processed.slice(0, itemCount);
}

async function hydrateCollectionFeed(
  section: ComponentHomepageCollectionFeed,
): Promise<ComponentHomepageCollectionFeed> {
  const { sourceType, selectionMode, layout } = section;
  const itemCount = LAYOUT_ITEM_COUNT[layout];

  if (selectionMode === "manual") {
    return {
      ...section,
      research_offers: section.research_offers?.slice(0, itemCount),
      groups: section.groups?.slice(0, itemCount),
      conferences: section.conferences?.slice(0, itemCount),
      courses: section.courses?.slice(0, itemCount),
      journals: section.journals?.slice(0, itemCount),
    };
  }

  switch (sourceType) {
    case "research-offer": {
      const data = await getCachedResearchOffers();
      return {
        ...section,
        research_offers: processItems(data, selectionMode, itemCount),
      };
    }
    case "research-group": {
      const data = await getCachedGroups();
      return {
        ...section,
        groups: processItems(data, selectionMode, itemCount),
      };
    }
    case "conference": {
      const data = await getCachedConferences();
      return {
        ...section,
        conferences: processItems(data, selectionMode, itemCount),
      };
    }
    case "course": {
      const data = await getCachedCourses();
      return {
        ...section,
        courses: processItems(data, selectionMode, itemCount),
      };
    }
    case "journal": {
      const data = await getCachedJournals();
      return {
        ...section,
        journals: processItems(data, selectionMode, itemCount),
      };
    }
    default:
      return section;
  }
}

async function hydrateSection(
  section: HomepageSection,
): Promise<HomepageSection> {
  if (section.__component === "homepage.collection-feed") {
    return hydrateCollectionFeed(section);
  }
  return section;
}

export async function loadHomepageData(): Promise<HomepageData> {
  const homepage = await getCachedHomepage();

  const hydratedSections = await Promise.all(
    homepage.sections.map(hydrateSection),
  );

  return {
    ...homepage,
    sections: hydratedSections,
  };
}
