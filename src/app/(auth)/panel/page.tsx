export default function PanelPage() {
  // TODO: Sprawdzenie roli. Jesli uzytkownik tylko staff-member to przekierowanie na /profile, jak admin to wyseitlenie tej strony i pokazanie co mozna tutaj zrobic.

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h1 className="mb-4 text-2xl font-bold">Panel edycji</h1>
      <p className="text-muted-foreground">This is the panel page content.</p>
    </div>
  );
}
