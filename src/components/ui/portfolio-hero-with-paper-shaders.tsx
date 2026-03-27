"use client"

import { Dithering } from "@paper-design/shaders-react"
import { useState } from "react"

import { MatrixText } from "@/components/ui/matrix-text"

export default function ResumePage() {
  const [isDarkMode, setIsDarkMode] = useState(true)

  return (
    <div className="relative min-h-screen overflow-hidden flex">
      <div
        className={`w-1/2 p-8 font-mono relative z-10 ${isDarkMode ? "bg-black text-white" : "bg-white text-black"}`}
      >
        {/* Theme toggle button in top right of left panel */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`absolute top-8 right-8 p-2 rounded-full transition-colors ${
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
          <h1 className="text-lg font-normal mb-8">maeski</h1>
          <div className="mb-8">
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
            <h3 className="text-lg font-normal">SOFTWARE ENGINEER</h3>
          </div>
        </div>

        {/* Experience Section */}
        <div className="mb-12 space-y-1">
          <div className="flex">
            <span className="w-28">NTT DATA</span>
            <span className="mx-2">Senior Dev</span>
            <span className="mx-4">2021 → ....</span>
          </div>
          <div className="flex">
            <span className="w-28">BANREP</span>
            <span className="mx-2">Intern</span>
            <span className="mx-4">2020 → 2021</span>
          </div>
          <div className="flex mt-12">
            <span className="w-28">UJTL</span>
            <span className="mx-2">Universidad</span>
            <span className="mx-4">2016 → 2021</span>
          </div>
        </div>

        {/* Footer Links Section */}
        <div className="footer mt-12">
          <div className="flex flex-wrap gap-3 text-sm font-mono">
            <a
              href="https://github.com/maeskidev"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 transition-colors ${
                isDarkMode
                  ? "border-white/20 bg-white/5 hover:bg-white/10"
                  : "border-black/20 bg-black/5 hover:bg-black/10"
              }`}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
                <path d="M12 0C5.37 0 0 5.37 0 12a12 12 0 0 0 8.2 11.4c.6.1.8-.26.8-.58v-2.25c-3.34.73-4.04-1.61-4.04-1.61-.55-1.4-1.34-1.77-1.34-1.77-1.1-.75.08-.74.08-.74 1.2.08 1.84 1.24 1.84 1.24 1.08 1.85 2.83 1.32 3.52 1 .1-.79.42-1.32.77-1.63-2.67-.3-5.47-1.34-5.47-5.94 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.53.12-3.18 0 0 1-.32 3.3 1.23a11.4 11.4 0 0 1 6 0c2.28-1.55 3.28-1.23 3.28-1.23.67 1.65.25 2.88.13 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.8 5.64-5.48 5.94.43.38.82 1.12.82 2.27v3.36c0 .32.2.69.82.58A12 12 0 0 0 24 12c0-6.63-5.37-12-12-12Z" />
              </svg>
              <span>GitHub</span>
            </a>
            <a
              href="https://www.linkedin.com/in/michaelquiros/"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 transition-colors ${
                isDarkMode
                  ? "border-white/20 bg-white/5 hover:bg-white/10"
                  : "border-black/20 bg-black/5 hover:bg-black/10"
              }`}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-current">
                <path d="M4.98 3.5A2.5 2.5 0 1 0 5 8.5a2.5 2.5 0 0 0-.02-5ZM3 9h4v12H3V9Zm7 0h3.83v1.64h.05c.53-1 1.82-2.06 3.75-2.06C21.54 8.58 23 11.04 23 14.6V21h-4v-5.67c0-1.35-.02-3.08-1.88-3.08-1.88 0-2.16 1.47-2.16 2.98V21h-4V9Z" />
              </svg>
              <span>LinkedIn</span>
            </a>
            {/* <a href="https://hojitadevida.com/" target="_blank" rel="noopener noreferrer" className="hover:underline">hojitadevida</a> */}
          </div>
        </div>
      </div>

      <div className="w-1/2 relative">
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
