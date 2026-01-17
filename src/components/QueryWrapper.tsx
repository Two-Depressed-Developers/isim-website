"use client";

import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { ReactNode, Suspense } from "react";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { Button } from "./ui/button";

type Props = {
  children: ReactNode;
  loadingFallback?: ReactNode;
  errorFallback?: (props: FallbackProps) => ReactNode;
};

const DefaultLoadingFallback = () => (
  <div className="flex min-h-[50vh] items-center justify-center">
    <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
  </div>
);

const DefaultErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => (
  <div className="bg-destructive/10 border-destructive/20 animate-in fade-in zoom-in flex flex-col items-center justify-center rounded-lg border p-8 text-center transition-all duration-300">
    <h2 className="text-destructive mb-2 text-xl font-bold">
      Something went wrong
    </h2>
    <p className="text-muted-foreground mx-auto mb-6 max-w-md">
      {error.message || "An unexpected error occurred while fetching data."}
    </p>
    <Button
      onClick={resetErrorBoundary}
      variant="destructive"
      className="shadow-md transition-all hover:shadow-lg active:scale-95"
    >
      Try again
    </Button>
  </div>
);

export function QueryWrapper({
  children,
  loadingFallback,
  errorFallback,
}: Props) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={
            errorFallback || ((props) => <DefaultErrorFallback {...props} />)
          }
        >
          <Suspense fallback={loadingFallback || <DefaultLoadingFallback />}>
            {children}
          </Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
