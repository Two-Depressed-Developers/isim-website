import { auth } from "@/lib/auth";
import ProfilePageClient from "@/components/custom/panel/profile/ProfilePageClient";

export default async function ProfilePage() {
  const session = await auth();

  const slug = session?.user?.memberProfileSlug;

  if (!slug) {
    return (
      <div className="flex flex-col items-center justify-center p-4">
        <h1 className="mb-4 text-2xl font-bold">
          Nie znaleziono powiązanego profilu
        </h1>
        <p className="text-muted-foreground">
          Wygląda na to, że nie masz powiązanego profilu. Skontaktuj się z
          administratorem, aby uzyskać więcej informacji.
        </p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center p-4">
        <h1 className="mb-4 text-2xl font-bold">Profil nie znaleziony</h1>
        <p className="text-muted-foreground">
          Nie udało się znaleźć profilu dla tego użytkownika.
        </p>
      </div>
    );
  }

  return <ProfilePageClient slug={slug} session={session} />;
}
