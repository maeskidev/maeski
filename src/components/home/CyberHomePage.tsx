"use client";

import Link from "next/link";

import type { BlogPostMeta } from "@/lib/blog";

import styles from "./CyberHomePage.module.css";

const experienceRows = [
  { org: "NTT DATA", role: "Senior Dev", dates: "2021 --> ...." },
  { org: "BANREP", role: "Intern", dates: "2020 --> 2021" },
  { org: "UJTL", role: "Universidad", dates: "2016 --> 2021" },
];

const navItems = [
  { label: "WORK", href: "#", disabled: true },
  { label: "READ.ME", href: "/blog", disabled: false },
  { label: "2D", href: "#", disabled: true },
] as const;

type CyberHomePageProps = {
  latestPost?: BlogPostMeta | null;
};

export default function CyberHomePage(_: CyberHomePageProps) {
  return (
    <main className={styles.pageShell}>
      <section className={styles.poster}>
        <header className={styles.identityBlock}>
          <p className={styles.handle}>@maeskrr</p>
          <span aria-hidden="true" className={styles.handleBorder} />
          <div className={styles.identityText}>
            <p>MICHAEL E. QUIROS</p>
            <p>SOFTWARE ENGINEER</p>
          </div>
        </header>

        <nav className={styles.visualNav} aria-label="Visual navigation">
          {navItems.map((item) =>
            item.disabled ? (
              <span key={item.label} className={styles.navItem}>
                {item.label}
              </span>
            ) : (
              <Link key={item.label} href={item.href} className={styles.navItem}>
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <section className={styles.illustrationArea} aria-hidden="true">
          <div className={styles.smokeCluster}>
            <span className={`${styles.smokePuff} ${styles.smokePuffOne}`} />
            <span className={`${styles.smokePuff} ${styles.smokePuffTwo}`} />
            <span className={`${styles.smokePuff} ${styles.smokePuffThree}`} />
            <span className={`${styles.smokePuff} ${styles.smokePuffFour}`} />
          </div>

          <div className={styles.cigaretteWrap}>
            <span className={styles.cigaretteBody} />
            <span className={styles.cigaretteTip} />
            <span className={styles.cigaretteBand} />
            <span className={styles.cigaretteDots} />
          </div>

          <div className={styles.lighter}>
            <span className={styles.lighterTop} />
            <span className={styles.lighterBody} />
            <span className={styles.lighterInner} />
            <span className={styles.flameOuter} />
            <span className={styles.flameInner} />
          </div>

          <div className={styles.panicBadge}>
            <span className={styles.panicBurst} />
            <span className={styles.panicRing} />
            <span className={styles.panicText}>PANIC!</span>
          </div>
        </section>

        <footer className={styles.experienceBlock}>
          <div className={styles.expTitleWrap}>
            <h2 className={styles.expTitle}>EXP</h2>
            <span aria-hidden="true" className={styles.expBorder} />
          </div>

          <div className={styles.expTable} role="presentation">
            {experienceRows.map((item) => (
              <div key={item.org} className={styles.expRow}>
                <span>{item.org}</span>
                <span>{item.role}</span>
                <span>{item.dates}</span>
              </div>
            ))}
          </div>
        </footer>
      </section>
    </main>
  );
}
