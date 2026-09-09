"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import type { BlogPostMeta } from "@/lib/blog";

import CigaretteCanvas from "./CigaretteCanvas";
import styles from "./PortfolioHome.module.css";

type PortfolioHomeProps = {
  latestPost?: BlogPostMeta | null;
};

export default function PortfolioHome(_: PortfolioHomeProps) {
  const [expOpen, setExpOpen] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const spotlightInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.code === "Space") {
        event.preventDefault();
        setMenuOpen(true);
      }

      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (menuOpen) spotlightInputRef.current?.focus();
  }, [menuOpen]);

  return (
    <main className={styles.layout}>

      {/* ── Col 1 · Row 1 — Brand ── */}
      <header className={styles.brand}>
        <a href="#" className={styles.handleLink}>@maeskrr</a>
        <Image
          src="/borde1.png"
          alt=""
          aria-hidden="true"
          className={styles.handleUnderline}
          width={147}
          height={14}
          priority
        />
        <section className={styles.profile}>
          <p className={styles.name}>MICHAEL E. QUIROS</p>
          <p className={styles.job}>SOFTWARE ENGINEER</p>
        </section>
      </header>

      {/* ── Col 2 · Rows 1-3 — Canvas Three.js ── */}
      <div className={styles.canvasArea}>
        <CigaretteCanvas />
      </div>

      {/* Navegación constante en la misma posición que el blog */}
      <nav className={styles.primaryNavigation} aria-label="Navegación principal">
        <Link href="/" className={styles.primaryNavigationItemActive} aria-current="page">
          home
        </Link>
        <Link href="/blog" className={styles.primaryNavigationItem}>
          readme.md
        </Link>
      </nav>

      {/* Spotlight de navegación rápida */}
      <button
        type="button"
        className={styles.menuButton}
        onClick={() => setMenuOpen(true)}
        aria-expanded={menuOpen}
        aria-controls="main-menu"
        aria-label="Abrir búsqueda de navegación"
      >
        <img src="/menu-icon.png" alt="" aria-hidden="true" />
      </button>

      {menuOpen && (
        <div className={styles.spotlightOverlay} onClick={() => setMenuOpen(false)}>
          <section
            id="main-menu"
            className={styles.menuPanel}
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
            <a href="#work" className={styles.navItem} onClick={() => setMenuOpen(false)}>
              <span>Work</span>
              <span>↵</span>
            </a>
            <a href="#2d" className={styles.navItem} onClick={() => setMenuOpen(false)}>
              <span>2D</span>
              <span>↵</span>
            </a>
          </section>
        </div>
      )}

      {/* ── Col 1 · Row 3 — Experiencia ── */}
      <section className={styles.experience} aria-label="Experiencia">
        <button
          type="button"
          className={styles.expTitleBtn}
          onClick={() => setExpOpen((v) => !v)}
          aria-expanded={expOpen}
          aria-controls="exp-table"
        >
          <h2 className={styles.expTitle}>EXP</h2>
          <span
            className={`${styles.expArrow} ${expOpen ? styles.expArrowOpen : ""}`}
            aria-hidden="true"
          >
            ▾
          </span>
        </button>

        <svg
          className={styles.expUnderline}
          width="71"
          height="9"
          viewBox="0 0 71 9"
          fill="none"
          aria-hidden="true"
        >
          <path d="M1.5 6.8C18 5.4 40 5.1 69.5 7.6" stroke="#000" strokeWidth="3" strokeLinecap="round" />
          <path d="M3 4.5C19 3.5 41 3.2 67 5.8" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.5" />
        </svg>

        <div
          id="exp-table"
          className={`${styles.expTable} ${expOpen ? styles.expTableOpen : styles.expTableClosed}`}
        >
          <span className={styles.expCell}>NTT DATA</span>
          <span className={styles.expCell}>Senior Dev</span>
          <span className={styles.expCell}>{"2021 --> . . . ."}</span>

          <span className={styles.expCell}>BANREP</span>
          <span className={styles.expCell}>Intern</span>
          <span className={styles.expCell}>{"2020 --> 2021"}</span>

          <span className={styles.expCell}>UJTL</span>
          <span className={styles.expCell}>Universidad</span>
          <span className={styles.expCell}>{"2016 --> 2021"}</span>
        </div>
      </section>

    </main>
  );
}
