import Link from "next/link";

export default function NotFound() {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-muted text-center">
        <h1 className="text-4xl font-bold text-primary">404</h1>
        <p className="mt-2 text-lg text-muted-foreground">Page not found</p>
        <Link
          href="/"
          className="mt-4 rounded-lg bg-primary px-4 py-2 text-white shadow-md hover:bg-primary/80"
        >
          Go back home
        </Link>
      </div>
    );
  }
  