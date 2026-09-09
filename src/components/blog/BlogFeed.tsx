"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"

import type { BlogPostMeta } from "@/lib/blog"

import styles from "./BlogFeed.module.css"

type BlogFeedProps = {
  posts: BlogPostMeta[]
}

export default function BlogFeed({ posts }: BlogFeedProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [spotlightOpen, setSpotlightOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const spotlightInputRef = useRef<HTMLInputElement>(null)
  const slideRefs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    const container = containerRef.current
    const slides = slideRefs.current.filter((slide): slide is HTMLElement => slide !== null)

    if (!container || slides.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const activeEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

        if (!activeEntry || activeEntry.intersectionRatio < 0.5) return

        const index = slideRefs.current.indexOf(activeEntry.target as HTMLElement)
        if (index !== -1) setActiveIndex(index)
      },
      { root: container, threshold: [0.5, 0.75] },
    )

    slides.forEach((slide) => observer.observe(slide))
    return () => observer.disconnect()
  }, [posts.length])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.code === "Space") {
        event.preventDefault()
        setSpotlightOpen(true)
      }

      if (event.key === "Escape") {
        setSpotlightOpen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  useEffect(() => {
    if (spotlightOpen) spotlightInputRef.current?.focus()
  }, [spotlightOpen])

  if (posts.length === 0) {
    return (
      <main className={styles.empty}>
        <p>No hay artículos publicados todavía.</p>
        <Link href="/" className={styles.homeLink}>
          Volver al inicio
        </Link>
      </main>
    )
  }

  return (
    <main className={styles.feedShell}>
      <nav className={styles.primaryNavigation} aria-label="Navegación principal">
        <Link href="/" className={styles.primaryNavigationItem}>
          home
        </Link>
        <Link href="/blog" className={styles.primaryNavigationItemActive} aria-current="page">
          readme.md
        </Link>
      </nav>

      <button
        type="button"
        className={styles.spotlightTrigger}
        aria-label="Abrir búsqueda de navegación"
        aria-expanded={spotlightOpen}
        aria-controls="blog-spotlight-menu"
        onClick={() => setSpotlightOpen(true)}
      >
        <img src="/menu-icon.png" alt="" aria-hidden="true" />
      </button>

      {spotlightOpen && (
        <div className={styles.spotlightOverlay} onClick={() => setSpotlightOpen(false)}>
          <section
            id="blog-spotlight-menu"
            className={styles.spotlightPanel}
            role="dialog"
            aria-modal="true"
            aria-label="Navegación rápida"
            onClick={(event) => event.stopPropagation()}
          >
            <label className={styles.spotlightSearch}>
              <span aria-hidden="true">⌕</span>
              <input ref={spotlightInputRef} type="search" placeholder="Buscar" aria-label="Buscar en navegación" />
              <kbd>esc</kbd>
            </label>
            <Link href="/#work" onClick={() => setSpotlightOpen(false)}>
              <span>Work</span>
              <span>↵</span>
            </Link>
            <Link href="/#2d" onClick={() => setSpotlightOpen(false)}>
              <span>2D</span>
              <span>↵</span>
            </Link>
          </section>
        </div>
      )}

      <div ref={containerRef} className={styles.feed} aria-label="Feed de artículos tipo TikTok">
        {posts.map((post, index) => (
          <article
            key={post.slug}
            ref={(element) => {
              slideRefs.current[index] = element
            }}
            className={`${styles.slide} ${index === activeIndex ? styles.slideActive : ""}`}
            aria-label={`Slide ${index + 1} de ${posts.length}: ${post.title}`}
          >
            <div className={styles.slideContent}>
              {/* Texto / “screen” */}
              <h1 className={styles.slideText}>{post.description ?? post.title}</h1>

              {/* Footer overlay: título + like */}
              <div className={styles.slideFooter}>
                <div className={styles.slideTitleBlock}>
                  <p className={styles.slideAttribution}>{post.publishedAt}</p>
                  <h2 className={styles.slideTitle}>{post.title}</h2>
                </div>

                <button
                  type="button"
                  className={styles.likeButton}
                  aria-label={`Marcar como favorito: ${post.title}`}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                >
                  <span className={styles.heart} aria-hidden="true">
                    ♥
                  </span>
                </button>
              </div>

              {/* Accesibilidad: clic para leer (no intrusivo) */}
              <Link href={`/blog/${post.slug}`} className={styles.readLink} aria-label={`Leer: ${post.title}`}>
                Leer artículo
              </Link>
            </div>
          </article>
        ))}
      </div>

    </main>
  )
}
