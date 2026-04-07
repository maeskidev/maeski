import Link from "next/link"

const ideas = [
  "Interactive typography experiments",
  "Shader presets comparison wall",
  "Motion-heavy card layouts",
  "Color systems and contrast tests",
]

export default function PlaygroundPage() {
  return (
    <main className="min-h-[calc(100vh-56px)] bg-white text-neutral-900">
      <div className="mx-auto w-full max-w-5xl px-6 py-16">
        <div className="mb-10 flex items-center justify-between gap-4">
          <h1 className="text-3xl font-semibold tracking-tight">Playground</h1>
          <Link
            href="/"
            className="rounded-full border border-neutral-300 px-4 py-2 text-sm transition-colors hover:bg-neutral-100"
          >
            Back to home
          </Link>
        </div>

        <p className="mb-8 max-w-2xl text-neutral-700">
          Space for prototypes, crazy UI ideas, and quick component tests before moving things into production.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          {ideas.map((idea) => (
            <section key={idea} className="rounded-2xl border border-neutral-300 p-5">
              <h2 className="text-base font-medium">{idea}</h2>
            </section>
          ))}
        </div>
      </div>
    </main>
  )
}
