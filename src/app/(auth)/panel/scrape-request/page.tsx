"use client";

import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { PanelPageTitle } from "@/components/custom/panel/PanelPageTitle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useScrapeRequest } from "@/data/queries/use-scrape";
import { useMemberData } from "@/data/queries/use-members";
import { useDataProposals } from "@/data/queries/use-data-proposals";
import { DataProposalsList } from "@/components/custom/panel/DataProposalsList";

export default function ScrapeRequestPage() {
  const { data: session } = useSession();
  const memberSlug = session?.user?.memberProfileSlug;

  const { data: member, isLoading: isLoadingMember } = useMemberData(memberSlug || "", {
    enabled: !!memberSlug,
  });

  const { data: proposals, isLoading: isLoadingProposals } = useDataProposals(
    member?.documentId || "",
    {
      enabled: !!member?.documentId,
    }
  );

  const { mutate: requestScrape, isPending } = useScrapeRequest();

  function onSync() {
    if (!member || !member.fullName) {
      toast.error("Nie znaleziono danych profilowych.");
      return;
    }

    const nameParts = member.fullName.split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ") || "";

    const payload = {
      first_name: firstName,
      last_name: lastName,
      current_institution: "AGH University",
      field_of_study: "Computer Science",
      member_document_id: member.documentId,
    };

    requestScrape(payload, {
      onSuccess: () => {
        toast.success("Zgłoszenie wyszukiwania zostało wysłane.");
      },
      onError: (error) => {
        console.error(error);
        toast.error("Wystąpił błąd podczas wysyłania zgłoszenia.");
      },
    });
  }

  if (isLoadingMember) {
      return (
          <div className="flex h-full w-full items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
      )
  }

  if (!memberSlug) {
      return (
          <div className="p-4">
              <PanelPageTitle title="Wyszukiwanie danych" />
              <Card>
                  <CardContent className="pt-6">
                      <p className="text-muted-foreground">Twój profil nie jest powiązany z żadnym pracownikiem.</p>
                  </CardContent>
              </Card>
          </div>
      )
  }

  return (
    <div className="space-y-6">
      <PanelPageTitle title="Wyszukiwanie danych" />
      
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Wyszukiwanie danych</CardTitle>
          <CardDescription>
            Kliknij przycisk poniżej, aby uzyskać propozycje aktualizacji swojego profilu na podstawie danych w zewnętrznych systemach.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col gap-4">
                <Button onClick={onSync} disabled={isPending || !member} className="w-full sm:w-auto">
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isPending ? "Wyszukiwanie..." : "Wyszukaj"}
                </Button>
            </div>
        </CardContent>
      </Card>

      {member && proposals && (
        <DataProposalsList 
          proposals={proposals} 
          memberDocumentId={member.documentId} 
        />
      )}
    </div>
  );
}
