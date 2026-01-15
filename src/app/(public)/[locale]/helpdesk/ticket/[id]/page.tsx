import { QueryWrapper } from "@/components/QueryWrapper";
import { Loader2 } from "lucide-react";
import TicketContent from "./ticket-content";

export default function TicketStatusPage() {
  return (
    <QueryWrapper
      loadingFallback={
        <div className="flex items-center justify-center py-12">
          <Loader2 className="text-primary h-8 w-8 animate-spin" />
        </div>
      }
    >
      <TicketContent />
    </QueryWrapper>
  );
}
