import Link from "next/link"

export default function ContentLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="relative min-h-screen">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-black/10 bg-white/75 backdrop-blur-md supports-[backdrop-filter]:bg-white/60">
        <nav className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="font-mono text-sm font-medium tracking-wide">
            MichaelQuiros.com
          </Link>
          <div className="flex items-center gap-2 text-sm">
            <Link href="/blog" className="rounded-full px-3 py-1.5 transition-colors hover:bg-black/5">
              README.MD
            </Link>
            <Link href="/playground" className="rounded-full px-3 py-1.5 transition-colors hover:bg-black/5">
              Playground
            </Link>
          </div>
        </nav>
      </header>

      <div className="pt-14">{children}</div>
    </div>
  )
}
