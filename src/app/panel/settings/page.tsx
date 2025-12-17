import ConnectSSOForm from "@/components/custom/panel/settings/ConnectSSOForm";
import NewPasswordForm from "@/components/custom/panel/settings/NewPasswordForm";
import { auth } from "@/lib/auth";

export default async function SettingsPage() {
  const session = await auth();

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h1 className="my-6 text-4xl font-bold">Ustawienia konta</h1>
      <div className="flex w-full max-w-7xl flex-row flex-wrap gap-2">
        <NewPasswordForm />
        <ConnectSSOForm />
      </div>
    </div>
  );
}
