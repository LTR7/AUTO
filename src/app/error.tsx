"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-3xl font-light tracking-tight">Something went wrong</h1>
      <button
        type="button"
        onClick={() => reset()}
        className="rounded-full border px-4 py-2 text-sm"
      >
        Try again
      </button>
    </main>
  );
}
