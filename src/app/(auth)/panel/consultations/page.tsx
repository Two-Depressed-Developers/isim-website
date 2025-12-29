import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import ConsultationsPageClient from "./ConsultationsPageClient";

export default async function ConsultationsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const memberSlug = session.user.memberProfileSlug;

  if (!memberSlug) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold">Konsultacje</h1>
        <p className="text-muted-foreground">
          Aby zarządzać konsultacjami, najpierw musisz powiązać profil
          pracownika.
        </p>
      </div>
    );
  }

  return <ConsultationsPageClient memberSlug={memberSlug} />;
}
