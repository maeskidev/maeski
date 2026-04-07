"use client"

import { Dithering } from "@paper-design/shaders-react"
import Link from "next/link"
import { useState } from "react"

import { MatrixText } from "@/components/ui/matrix-text"
import SocialMedia from "./socialMedia"
import HaruAscii from "./ascii/haruAscci"
import type { BlogPostMeta } from "@/lib/blog"

interface ResumePageProps {
  latestPost?: BlogPostMeta | null
}

export default function ResumePage({ latestPost }: ResumePageProps) {
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="relative min-h-screen overflow-hidden flex ">
      <div
        className={`w-1/2 p-8 font-mono relative z-10 max-md:w-full grid items-center ${isDarkMode ? "bg-black text-white max-md:bg-[#000000aa]" : "bg-white max-md:bg-[#ffffff7f] text-black"}`}
      >
        {/* Theme toggle button in top right of left panel */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`absolute top-0 right-0 p-2 rounded-full transition-colors ${
            isDarkMode ? "hover:bg-white/10" : "hover:bg-black/10"
          }`}
          aria-label="Toggle theme"
        >
          {isDarkMode ? (
            // Sun icon for light mode
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
          ) : (
            // Moon icon for dark mode
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>

        {/* Header */}
        <div className="mb-12">
          <div className="mb-8 flex justify-between flex-wrap items-center gap-3">
            <h2 className="text-lg font-normal">@maeskrr</h2>
            <nav className="flex flex-wrap items-center gap-2 text-xs" aria-label="Primary">
              <Link
                href="/blog"
                className={`inline-flex items-center rounded-full border px-3 py-1.5 transition-colors ${
                  isDarkMode
                    ? "border-white/20 bg-white/5 hover:bg-white/10"
                    : "border-black/20 bg-black/5 hover:bg-black/10"
                }`}
              >
                README.MD
              </Link>
              <Link
                href="/playground"
                className={`inline-flex items-center rounded-full border px-3 py-1.5 transition-colors ${
                  isDarkMode
                    ? "border-white/20 bg-white/5 hover:bg-white/10"
                    : "border-black/20 bg-black/5 hover:bg-black/10"
                }`}
              >
                Playground
              </Link>
            </nav>
          </div>
          <article className="mb-8">
            <h1 className="text-xs text-black">Michael Esteban Quiros Marin</h1>
            <h2 className="text-lg font-normal">
              <MatrixText
                text="MICHAEL E. QUIROS"
                className="min-h-0"
                letterClassName="text-lg font-normal leading-none"
                initialDelay={3000}
                letterAnimationDuration={300}
                letterInterval={200}
              />
            </h2>
            <p className="text-lg font-normal">SOFTWARE ENGINEER</p>
          </article>
        </div>

        <div>
          <HaruAscii isDarkMode={isDarkMode} />
          {latestPost && (
            <Link
              href={`/blog/${latestPost.slug}`}
              className={`mt-4 inline-flex items-center gap-2 text-xs opacity-50 hover:opacity-100 transition-opacity ${
                isDarkMode ? "text-white" : "text-black"
              }`}
            >
              <span className="uppercase tracking-widest text-[10px]">latest</span>
              <span>→</span>
              <span>{latestPost.title}</span>
            </Link>
          )}
        </div>
        

        
        {/* Experience Section */}
        <div className="self-end ">
          {/* socialmedia Links Section */}
          <SocialMedia isDarkMode={isDarkMode} />
          <h3
            className="my-4 text-lg font-semibold cursor-pointer select-none"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            Experiencia
          </h3>
          <div
            className={`text-sm font-consoles overflow-hidden transition-all duration-300 ease-in-out ${
              isExpanded ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="grid grid-cols-3 mb-4">
              <span className="">NTT DATA</span>
              <span className="">Senior Dev</span>
              <span className="">2021 → ....</span>
            </div>
            <div className="grid grid-cols-3 mb-4">
              <span className="">BANREP</span>
              <span className="">Intern</span>
              <span className="">2020 → 2021</span>
            </div>
            <div className="grid grid-cols-3 mt-12">
              <span className="">UJTL</span>
              <span className="">Universidad</span>
              <span className="">2016 → 2021</span>
            </div>
          </div>
        </div>

      </div>

      <div className="w-1/2 relative max-md:absolute max-md:w-full max-md:h-full">
        <Dithering
          style={{ height: "100%", width: "100%" }}
          colorBack={isDarkMode ? "hsl(0, 0%, 0%)" : "hsl(0, 0%, 95%)"}
          colorFront={isDarkMode ? "hsl(160, 100%, 55%)" : "hsl(220, 100%, 70%)"}
          shape="warp"
          type="4x4"
          pxSize={3}
          offsetX={0}
          offsetY={0}
          scale={0.8}
          rotation={0}
          speed={0.1}
        />
      </div>
    </div>
  )
}
