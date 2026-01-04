import { Suspense } from "react";
import { VerifyTicketContent } from "./verify-content";

export default function VerifyTicketPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto flex justify-center py-8">
          Loading...
        </div>
      }
    >
      <VerifyTicketContent />
    </Suspense>
  );
}
