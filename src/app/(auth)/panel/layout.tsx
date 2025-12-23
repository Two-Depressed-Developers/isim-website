import PanelNav from "@/components/custom/panel/PanelNav";

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <PanelNav />
      <main className="flex grow flex-col">{children}</main>
    </>
  );
}
