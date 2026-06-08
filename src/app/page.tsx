import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-black px-6">
      <main className="w-full max-w-2xl text-center sm:text-left">
        <h1 className="text-4xl font-bold tracking-tight text-black dark:text-zinc-50 mb-4">
          Recipe Manager
        </h1>

        <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8">
          Your personal space to create, organize, and explore delicious recipes.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Link
            href="/recipes"
            className="px-6 py-3 rounded-full bg-black text-white dark:bg-white dark:text-black font-medium hover:opacity-80 transition"
          >
            View Recipes
          </Link>

          <Link
            href="/recipes/new"
            className="px-6 py-3 rounded-full border border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition"
          >
            Add New Recipe
          </Link>
        </div>
      </main>
    </div>
  );
}
