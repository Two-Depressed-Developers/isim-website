import { PanelPageTitle } from "@/components/custom/panel/PanelPageTitle";
import ManageTickets from "@/components/custom/panel/tickets/ManageTickets";
import { auth } from "@/lib/auth";
import { requireHelpdeskMember } from "@/lib/auth.utils";

export default async function TicketsPage() {
  const session = await auth();
  await requireHelpdeskMember();

  if (!session) {
    return (
      <>
        <PanelPageTitle title="Zarządzanie zgłoszeniami" />
        <div className="flex flex-col items-center justify-center p-4">
          <h1 className="mb-4 text-2xl font-bold">Dostęp zabroniony</h1>
        </div>
      </>
    );
  }

  return (
    <>
      <PanelPageTitle title="Zarządzanie zgłoszeniami" />
      <ManageTickets session={session} />
    </>
  );
}
