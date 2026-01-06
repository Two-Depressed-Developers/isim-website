import { auth } from "@/lib/auth";
import { PanelPageTitle } from "@/components/custom/panel/PanelPageTitle";
import ProfilePageClient from "@/components/custom/panel/profile/ProfilePageClient";
import { requireStaffMember } from "@/lib/auth.utils";

export default async function ProfilePage() {
  const session = await auth();
  await requireStaffMember();
  const slug = session?.user?.memberProfileSlug;

  if (!slug) {
    return (
      <>
        <PanelPageTitle title="Profil" />
        <div className="flex flex-col items-center justify-center p-4">
          <h1 className="mb-4 text-2xl font-bold">
            Nie znaleziono powiązanego profilu
          </h1>
          <p className="text-muted-foreground">
            Wygląda na to, że nie masz powiązanego profilu.
          </p>
        </div>
      </>
    );
  }

  if (!session) {
    return (
      <>
        <PanelPageTitle title="Profil" />
        <div className="flex flex-col items-center justify-center p-4">
          <h1 className="mb-4 text-2xl font-bold">Profil nie znaleziony</h1>
        </div>
      </>
    );
  }

  return (
    <>
      <PanelPageTitle title="Edycja profilu" />
      <ProfilePageClient slug={slug} session={session} />
    </>
  );
}
