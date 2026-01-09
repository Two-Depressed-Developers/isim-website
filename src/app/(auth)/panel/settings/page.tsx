import { PanelPageTitle } from "@/components/custom/panel/PanelPageTitle";
import ChangeUsernameForm from "@/components/custom/panel/settings/ChangeUsernameForm";
import NewPasswordForm from "@/components/custom/panel/settings/NewPasswordForm";

export default async function SettingsPage() {
  return (
    <>
      <PanelPageTitle title="Ustawienia konta" />
      <div className="flex flex-col items-center justify-center p-4">
        <div className="grid w-full max-w-7xl grid-cols-1 gap-4 lg:grid-cols-2">
          <ChangeUsernameForm />
          <NewPasswordForm />
        </div>
      </div>
    </>
  );
}
