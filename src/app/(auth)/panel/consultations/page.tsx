import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import ConsultationBookingsList from "@/components/custom/panel/ConsultationBookingsList";

export default async function ConsultationsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const memberSlug = session.user.memberProfileSlug;

  if (!memberSlug) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold">Prośby o konsultacje</h1>
        <p className="text-muted-foreground">
          Aby zarządzać prośbami o konsultacje, najpierw musisz powiązać profil
          pracownika.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Prośby o konsultacje</h1>
        <p className="text-muted-foreground">
          Zarządzaj prośbami studentów o konsultacje
        </p>
      </div>

      <ConsultationBookingsList memberSlug={memberSlug} />
    </div>
  );
}
