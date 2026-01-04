import { PanelPageTitle } from "@/components/custom/panel/PanelPageTitle";
import ChangeUsernameForm from "@/components/custom/panel/settings/ChangeUsernameForm";
import ConnectSSOForm from "@/components/custom/panel/settings/ConnectSSOForm";
import NewPasswordForm from "@/components/custom/panel/settings/NewPasswordForm";

export default async function SettingsPage() {
  return (
    <>
      <PanelPageTitle title="Ustawienia konta" />
      <div className="flex flex-col items-center justify-center p-4">
        <div className="grid w-full max-w-7xl grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="flex flex-col gap-4">
            <ChangeUsernameForm />
            <ConnectSSOForm />
          </div>
          <div>
            <NewPasswordForm />
          </div>
        </div>
      </div>
    </>
  );
}
