import { PanelPageTitle } from "@/components/custom/panel/PanelPageTitle";
import ManageTickets from "@/components/custom/panel/tickets/ManageTickets";
import { requireAdmin } from "@/lib/dal";

export default async function TicketsPage() {
  await requireAdmin();

  return (
    <>
      <PanelPageTitle title="Zarządzanie zgłoszeniami" />
      <ManageTickets />
    </>
  );
}
