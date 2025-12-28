"use client";

import { useState } from "react";
import { Check, X, Loader2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DataProposal,
} from "@/data/api/data-proposals";
import { useUpdateDataProposal } from "@/data/queries/use-data-proposals";

interface DataProposalsListProps {
  proposals: DataProposal[];
  memberDocumentId: string;
}

export function DataProposalsList({
  proposals,
  memberDocumentId,
}: DataProposalsListProps) {
  const { data: session } = useSession();
  const { mutate: updateProposal, isPending } = useUpdateDataProposal(memberDocumentId);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleStatusUpdate = (
    proposal: DataProposal,
    itemIndex: number,
    newStatus: "accepted" | "declined"
  ) => {
    if (!session?.accessToken) return;

    const itemUrl = proposal.scrapedData[itemIndex].url;
    setProcessingId(`${proposal.documentId}-${itemIndex}`);

    const updatedScrapedData = [...proposal.scrapedData];
    updatedScrapedData[itemIndex] = {
      ...updatedScrapedData[itemIndex],
      status: newStatus,
    };

    updateProposal(
      {
        documentId: proposal.documentId,
        data: { scrapedData: updatedScrapedData },
        accessToken: session.accessToken,
      },
      {
        onSuccess: () => {
          toast.success(
            newStatus === "accepted"
              ? "Zaakceptowano propozycję."
              : "Odrzucono propozycję."
          );
          setProcessingId(null);
        },
        onError: () => {
          toast.error("Wystąpił błąd podczas aktualizacji statusu.");
          setProcessingId(null);
        },
      }
    );
  };

  if (!proposals.length) {
    return null;
  }

  const pendingItems = proposals.flatMap((proposal) =>
    proposal.scrapedData
      .map((item, index) => ({ item, index, proposal }))
      .filter((entry) => entry.item.status === "pending")
  );

  if (pendingItems.length === 0) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Brak nowych propozycji</CardTitle>
                <CardDescription>Nie znaleziono nowych danych do zatwierdzenia.</CardDescription>
            </CardHeader>
        </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Propozycje aktualizacji</h3>
      <div className="grid gap-4">
        {pendingItems.map(({ item, index, proposal }) => {
            const uniqueKey = `${proposal.documentId}-${index}`;
            const isProcessing = processingId === uniqueKey;

            return (
                <Card key={uniqueKey}>
                    <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-4">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <Badge variant="outline">{item.source}</Badge>
                                </div>
                                <CardTitle className="text-base leading-tight">
                                    {item.title}
                                </CardTitle>
                            </div>
                        </div>
                        <CardDescription className="line-clamp-2">
                            {item.authors}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-3 text-sm">
                        <div className="grid gap-1.5 text-muted-foreground">
                            <p>{item.description}</p>
                            {item.url && (
                                <a
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 hover:underline text-primary w-fit"
                                >
                                    Zobacz źródło <ExternalLink className="h-3 w-3" />
                                </a>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2 pt-0">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusUpdate(proposal, index, "declined")}
                            disabled={isProcessing || isPending}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20"
                        >
                            {isProcessing ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <>
                                    <X className="mr-1.5 h-3.5 w-3.5" />
                                    Odrzuć
                                </>
                            )}
                        </Button>
                        <Button
                            size="sm"
                            onClick={() => handleStatusUpdate(proposal, index, "accepted")}
                            disabled={isProcessing || isPending}
                        >
                            {isProcessing ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <>
                                    <Check className="mr-1.5 h-3.5 w-3.5" />
                                    Zatwierdź
                                </>
                            )}
                        </Button>
                    </CardFooter>
                </Card>
            );
        })}
      </div>
    </div>
  );
}
