import { Suspense } from "react";
import { LoginPageContent } from "./login-content";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-muted flex grow flex-col items-center justify-center">
          Loading...
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
