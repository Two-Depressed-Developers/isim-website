import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { PanelSidebar } from "@/components/custom/panel/PanelSidebar";
import PanelNav from "@/components/custom/panel/PanelNav";
import { PanelProvider } from "@/context/PanelContext";

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PanelProvider>
      <SidebarProvider defaultOpen={true}>
        <PanelSidebar />
        <SidebarInset className="bg-muted/10 flex flex-1 flex-col">
          <PanelNav />
          <main className="flex-1 p-4 md:p-6">
            <div className="mx-auto w-full max-w-7xl">{children}</div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </PanelProvider>
  );
}
