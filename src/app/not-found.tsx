import Link from "next/link";

const NotFound = () => {
  return (
    <div className="flex h-full min-h-96 grow flex-col items-center justify-center gap-y-4 bg-muted p-6 text-center">
      <h1>404 - Not Found!</h1>

      <Link
        href="/"
        className="mt-4 inline-block rounded-md bg-primary px-4 py-2 text-foreground transition-colors hover:bg-primary/90"
      >
        Go to Home
      </Link>
    </div>
  );
};

export default NotFound;
