import { verifySession } from "@/lib/auth.utils";

export default async function PanelPage() {
  await verifySession();

  return (
    <>
      <div className="flex flex-col items-center justify-center p-4">
        <h1 className="mb-4 text-2xl font-bold">Panel edycji</h1>
        <p className="text-muted-foreground">
          Witaj w panelu. Wybierz opcję z menu bocznego.
        </p>
      </div>
    </>
  );
}
