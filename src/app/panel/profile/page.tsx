import { auth } from "@/lib/auth";
import { getMemberData } from "@/data/loaders";
import ProfileForm from "@/components/custom/panel/profile/ProfileForm";

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

  const member = await getMemberData(slug);

  if (member.error) {
    return (
      <div className="flex flex-col items-center justify-center p-4">
        <h1 className="mb-4 text-2xl font-bold">Profil nie znaleziony</h1>
        <p className="text-muted-foreground">
          Nie udało się znaleźć profilu dla tego użytkownika.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <ProfileForm member={member} session={session} />
    </div>
  );
}
