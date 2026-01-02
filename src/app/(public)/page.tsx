import HomepageBuilder from "@/components/custom/homepage/HomepageBuilder";
import { loadHomepageData } from "@/data/loaders/homepage";

export default async function Home() {
  const homepage = await loadHomepageData();

  return (
    <div className="flex grow flex-col">
      <HomepageBuilder homepage={homepage} />
    </div>
  );
}
