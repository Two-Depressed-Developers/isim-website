import BreadcrumbsDataLoader from "@/components/custom/breadcrumb/BreadcrumbsDataLoader";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { BreadcrumbsProvider } from "@/context/BreadcrumbsContext";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex grow flex-col">
        <BreadcrumbsProvider>
          <BreadcrumbsDataLoader />
          {children}
        </BreadcrumbsProvider>
      </main>
      <Footer />
    </>
  );
}
