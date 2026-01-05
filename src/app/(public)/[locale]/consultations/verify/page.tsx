import { Suspense } from "react";
import { VerifyConsultationContent } from "./verify-content";

export default function VerifyConsultationPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto flex justify-center py-8">
          Loading...
        </div>
      }
    >
      <VerifyConsultationContent />
    </Suspense>
  );
}
