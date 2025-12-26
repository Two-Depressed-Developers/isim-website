import { PanelPageTitle } from "@/components/custom/panel/PanelPageTitle";
import ConnectSSOForm from "@/components/custom/panel/settings/ConnectSSOForm";
import NewPasswordForm from "@/components/custom/panel/settings/NewPasswordForm";

export default async function SettingsPage() {
  return (
    <>
      <PanelPageTitle title="Ustawienia konta" />
      <div className="flex flex-col items-center justify-center p-4">
        <div className="flex w-full max-w-7xl flex-row flex-wrap gap-2">
          <NewPasswordForm />
          <ConnectSSOForm />
        </div>
      </div>
    </>
  );
}
