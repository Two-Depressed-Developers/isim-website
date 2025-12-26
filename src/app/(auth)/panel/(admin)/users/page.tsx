import { requireAdmin } from "@/lib/dal";
import { PanelPageTitle } from "@/components/custom/panel/PanelPageTitle";
import UsersAddForm from "@/components/custom/panel/users/UsersAddForm";

export default async function UsersPage() {
  await requireAdmin();

  return (
    <>
      <PanelPageTitle title="Tworzenie użytkowników" />
      <UsersAddForm />
    </>
  );
}
