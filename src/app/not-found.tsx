import Link from "next/link";

const NotFound = () => {
  return (
    <div className="bg-muted flex h-full min-h-96 grow flex-col items-center justify-center gap-y-4 p-6 text-center">
      <h1>404 - Not Found!</h1>

      <Link
        href="/"
        className="bg-primary text-foreground hover:bg-primary/90 mt-4 inline-block rounded-md px-4 py-2 transition-colors"
      >
        Go to Home
      </Link>
    </div>
  );
};

export default NotFound;
