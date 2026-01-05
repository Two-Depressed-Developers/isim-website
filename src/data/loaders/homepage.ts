import { unstable_cache } from "next/cache";
import { getHomepage } from "../api/homepage";
import { getResearchOffers } from "../api/research-offers";
import { getGroupsData } from "../api/groups";
import { getConferences } from "../api/conferences";
import { getCourses } from "../api/courses";
import { getJournals } from "../api/journals";
import {
  ComponentHomepageCollectionFeed,
  HomepageData,
  HomepageSection,
  StrapiBaseItem,
} from "@/types";
import { LAYOUT_ITEM_COUNT, FIVE_MINUTES } from "@/consts/homepage";
import { getLocale } from "next-intl/server";

function getCachedHomepage(locale: string) {
  return unstable_cache(() => getHomepage(locale), ["homepage", locale], {
    revalidate: FIVE_MINUTES,
    tags: ["homepage", locale],
  })();
}

function getCachedResearchOffers(locale: string) {
  return unstable_cache(
    () => getResearchOffers(locale),
    ["research-offers", locale],
    {
      revalidate: FIVE_MINUTES,
      tags: ["research-offers", locale],
    },
  )();
}

function getCachedGroups(locale: string) {
  return unstable_cache(() => getGroupsData(locale), ["groups", locale], {
    revalidate: FIVE_MINUTES,
    tags: ["groups", locale],
  })();
}

function getCachedConferences(locale: string) {
  return unstable_cache(() => getConferences(locale), ["conferences", locale], {
    revalidate: FIVE_MINUTES,
    tags: ["conferences", locale],
  })();
}

function getCachedCourses(locale: string) {
  return unstable_cache(() => getCourses(locale), ["courses", locale], {
    revalidate: FIVE_MINUTES,
    tags: ["courses", locale],
  })();
}

function getCachedJournals(locale: string) {
  return unstable_cache(() => getJournals(locale), ["journals", locale], {
    revalidate: FIVE_MINUTES,
    tags: ["journals", locale],
  })();
}

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
    const dateA = new Date(a.publishedAt || a.createdAt || 0).getTime();
    const dateB = new Date(b.publishedAt || b.createdAt || 0).getTime();
    return dateB - dateA;
  });
}

function processItems<T extends { createdAt?: string; publishedAt?: string }>(
  items: T[],
  selectionMode: "newest" | "random" | "manual",
  itemCount: number,
): T[] {
  switch (selectionMode) {
    case "newest":
      return sortByNewest(items).slice(0, itemCount);
    case "random":
      return shuffleArray(items).slice(0, itemCount);
    default:
      return items.slice(0, itemCount);
  }
}

type SourceConfig = {
  fetcher: (locale: string) => Promise<StrapiBaseItem[]>;
  key: keyof ComponentHomepageCollectionFeed;
};

const SOURCE_CONFIG: Record<string, SourceConfig> = {
  "research-offer": {
    fetcher: getCachedResearchOffers,
    key: "research_offers",
  },
  "research-group": { fetcher: getCachedGroups, key: "groups" },
  conference: { fetcher: getCachedConferences, key: "conferences" },
  course: { fetcher: getCachedCourses, key: "courses" },
  journal: { fetcher: getCachedJournals, key: "journals" },
};

async function hydrateCollectionFeed(
  section: ComponentHomepageCollectionFeed,
  locale: string,
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

  const config = SOURCE_CONFIG[sourceType as keyof typeof SOURCE_CONFIG];

  if (!config) return section;

  try {
    const data = await config.fetcher(locale);

    return {
      ...section,
      [config.key]: processItems(data, selectionMode, itemCount),
    };
  } catch (error) {
    console.error(`Błąd ładowania danych dla ${sourceType}:`, error);
    return section;
  }
}

async function hydrateSection(
  section: HomepageSection,
  locale: string,
): Promise<HomepageSection> {
  if (section.__component === "homepage.collection-feed") {
    return hydrateCollectionFeed(section, locale);
  }
  return section;
}

export async function loadHomepageData(): Promise<HomepageData | null> {
  try {
    const locale = await getLocale();
    const homepage = await getCachedHomepage(locale);

    const hydratedSections = await Promise.all(
      homepage.sections.map((section) => hydrateSection(section, locale)),
    );

    return {
      ...homepage,
      sections: hydratedSections,
    };
  } catch (error) {
    console.error("Błąd podczas ładowania danych strony głównej:", error);
    return null;
  }
}
