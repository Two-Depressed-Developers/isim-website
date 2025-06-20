import { auth } from "@/lib/auth";
import { getMemberData, getMemberSchema } from "@/data/loaders";
import Profile from "@/components/custom/panel/profile/Profile/Profile";

export default async function ProfilePage() {
  const session = await auth();

  const slug = session?.user?.memberProfileSlug || "krzysztof-regulski"; // !
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

  const memberSchema = await getMemberSchema();
  const member = await getMemberData(slug);

  if (member.error || memberSchema.error) {
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
      <Profile member={member} schema={memberSchema} session={session} />
    </div>
  );
}
