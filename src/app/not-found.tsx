import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-3xl font-light tracking-tight">404</h1>
      <p className="text-sm opacity-70">This page could not be found.</p>
      <Link href="/" className="text-sm underline underline-offset-4">
        Back home
      </Link>
    </main>
  );
}
