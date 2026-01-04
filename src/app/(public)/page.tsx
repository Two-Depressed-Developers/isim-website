import HomepageBuilder from "@/components/custom/homepage/HomepageBuilder";
import { loadHomepageData } from "@/data/loaders/homepage";

export default async function Home() {
  const homepage = await loadHomepageData();

  if (!homepage) {
    return (
      <div className="flex grow flex-col items-center justify-center">
        <p className="text-muted-foreground">
          Nie udało się załadować strony głównej. Spróbuj ponownie później.
        </p>
      </div>
    );
  }

  return (
    <div className="flex grow flex-col">
      <HomepageBuilder homepage={homepage} />
    </div>
  );
}
