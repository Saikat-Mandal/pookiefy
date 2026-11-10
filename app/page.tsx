"use client";

import { useState, useEffect } from "react";
import Lenis from "lenis";
import Image from "next/image";

const UNLOCK_AT = "2026-11-11T23:11:00+05:30";
// const UNLOCK_AT = "2026-11-10T23:59:00+05:30";
const UNLOCK_TIME_ZONE = "Asia/Kolkata";

const formattedUnlockTime = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
  timeZone: UNLOCK_TIME_ZONE,
})
  .format(new Date(UNLOCK_AT))
  .replace(/\b(am|pm)\b/i, (meridiem) => meridiem.toUpperCase());

/* --------------------------------------------------------------------------
   Hook: reveals section content once when it enters the viewport.
   Content stays visible after scrolling back up (never re-hides).
   -------------------------------------------------------------------------- */
function useScrollReveal() {
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (!ref) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -12% 0px" }
    );
    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref]);

  return [setRef, revealed] as const;
}

/* ----------------------------------------------------------------
   Songs — the play links open a YouTube Music search for each track.
   The cover art is original SVG artwork made for these cards.
   ----------------------------------------------------------------- */
const SONGS = [
  {
    id: 1,
    title: "Purple",
    artist: "Olivia Rodrigo",
    colors: { start: "#3d2459", end: "#bd83b7", accent: "#f6d5e9" },
    motif: "✦",
  },
  {
    id: 2,
    title: "Cigarettes",
    artist: "Juice WRLD",
    colors: { start: "#381d29", end: "#c75d4f", accent: "#ffc18b" },
    motif: "✳",
  },
  {
    id: 3,
    title: "Wishlist",
    artist: "Taylor Swift",
    colors: { start: "#243c59", end: "#83a9bd", accent: "#f7e6be" },
    motif: "✧",
  },
];

/* ----------------------------------------------------------------
   Photos — three empty Polaroid-style frames. Replace the SVGs
   with your own image files whenever you like.
   ----------------------------------------------------------------- */
const PHOTOS = ["/1.jpg", "/2.jpg", "/3.jpg"];

export default function LoveLetter() {
  const [timeUnlocked, setTimeUnlocked] = useState(false);
  const [wishMade, setWishMade] = useState(false);
  const [wishTransitioning, setWishTransitioning] = useState(false);
  const [wishShown, setWishShown] = useState(false);
  const [scrollShown, setScrollShown] = useState(false);

  useEffect(() => {
    const unlockTimestamp = new Date(UNLOCK_AT).getTime();

    if (!Number.isFinite(unlockTimestamp)) {
      console.error(`Invalid UNLOCK_AT value: ${UNLOCK_AT}`);
      return;
    }

    const updateUnlockState = () => {
      const unlocked = Date.now() >= unlockTimestamp;
      setTimeUnlocked(unlocked);
      return unlocked;
    };

    if (updateUnlockState()) return;

    const intervalId = window.setInterval(() => {
      if (updateUnlockState()) window.clearInterval(intervalId);
    }, 10_000);

    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (
      !wishMade ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.09,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 0.9,
      prevent: (node) => node.closest(".story-carousel") !== null,
    });

    return () => lenis.destroy();
  }, [wishMade]);

  const handleMakeWish = () => {
    setWishMade(true);
    const transitionDuration = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? 0
      : 1700;

    if (transitionDuration > 0) setWishTransitioning(true);
    setTimeout(() => {
      setWishTransitioning(false);
      setWishShown(true);
    }, transitionDuration);
    setTimeout(() => setScrollShown(true), transitionDuration + 900);
  };

  const [memoriesRef, memoriesRevealed] = useScrollReveal();
  const [photosRef, photosRevealed] = useScrollReveal();
  const [songsRef, songsRevealed] = useScrollReveal();
  const [finalRef, finalRevealed] = useScrollReveal();

  if (!timeUnlocked) {
    return (
      <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#5b2333] px-6 py-16 text-center text-[#f7f4f3]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,rgba(242,67,51,0.22),transparent_55%)]" />
        <div className="relative z-10 flex max-w-lg flex-col items-center">
          <span className="mb-6 font-playfair text-5xl text-[#ffd1ca]" aria-hidden="true">
            11:11
          </span>
          <h1 className="font-playfair text-[clamp(2rem,9vw,3.5rem)] font-light leading-tight">
            nah nah not now HEHEHE
          </h1>
          <p className="mt-5 text-sm tracking-wide text-[#e4cfd0]">
            Come back on{" "}
            <time dateTime={UNLOCK_AT}>{formattedUnlockTime} IST</time>
          </p>
        </div>
      </main>
    );
  }

  return (
    <div
      data-scroll-locked={wishMade ? "false" : "true"}
      className="relative flex flex-col"
    >
      {/* ============================================================
          1. OPENING — 11:11
          ============================================================ */}
      <section className="story-panel story-panel--opening relative min-h-[100svh] w-full flex flex-col items-center justify-center px-6 overflow-hidden">
        {/* subtle, elegant background animation */}
        <div
          className="absolute inset-0 -z-10 overflow-hidden pointer-events-none"
          aria-hidden="true"
        >
          <div
            className="absolute top-[-6%] left-[-8%] w-[44%] h-[44%] rounded-full bg-rose/10 blur-[120px] animate-float"
          ></div>
          <div
            className="absolute bottom-[-14%] right-[-10%] w-[56%] h-[56%] rounded-full bg-[#c9aeb3]/8 blur-[150px] animate-float-slow"
          ></div>
          <div
            className="absolute top-[40%] left-[52%] w-[34%] h-[34%] rounded-full bg-[#9a8fb0]/6 blur-[80px] animate-float"
            style={{ animationDelay: "-10s" }}
          ></div>
        </div>

        {/* initial state */}
        {!wishMade && (
          <div
            className="relative z-10 flex flex-col items-center text-center space-y-6 transition-all duration-700 ease-out"
          >
            <h1
              className="hero-enter font-playfair text-[clamp(2.5rem,14vw,9rem)] font-light tracking-tight leading-none text-foreground"
            >
              11:11
            </h1>
            <p className="hero-enter font-sans text-[clamp(1rem,3vw,1.3rem)] text-muted tracking-[0.28em] uppercase">
              Make a wish.
            </p>
            <button
              onClick={handleMakeWish}
              className="hero-enter mt-6 inline-flex min-h-14 items-center gap-3 rounded-full bg-[#f24333] px-8 py-4 text-sm font-semibold tracking-widest uppercase text-white shadow-[0_10px_30px_rgba(242,67,51,0.28)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#ba1b1d] hover:shadow-[0_14px_36px_rgba(242,67,51,0.38)] active:translate-y-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-[#5b2333]"
            >
              Make a wish <span className="text-foreground">→</span>
            </button>
          </div>
        )}

        {wishTransitioning && (
          <div
            className="wish-interlude absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center"
            role="status"
            aria-label="A little wish, on its way"
          >
            <div className="wish-orbit" aria-hidden="true">
              <span className="wish-orbit__ring wish-orbit__ring--outer" />
              <span className="wish-orbit__ring wish-orbit__ring--inner" />
              <span className="wish-orbit__spark wish-orbit__spark--one">✦</span>
              <span className="wish-orbit__spark wish-orbit__spark--two">✧</span>
              <span className="wish-orbit__spark wish-orbit__spark--three">✦</span>
              <span className="wish-orbit__heart">♡</span>
            </div>
            <p className="wish-interlude__caption">
              A little wish, on its way
            </p>
          </div>
        )}

        {/* revealed message — same page, no navigation */}
        {wishShown && (
          <div
            className="wish-message relative z-10 flex flex-col items-center text-center space-y-6"
          >
            <p
              className="font-playfair text-[clamp(1.25rem,5vw,2rem)] font-medium leading-relaxed text-foreground max-w-md text-balance"
            >
              <span className="block">I wished for you.</span>
              <span className="mt-6 block font-sans font-normal text-[clamp(1rem,3vw,1.2rem)] text-muted leading-relaxed">
                Even though you're far away,<br />
                here's a little place where we can be together.
              </span>
            </p>
          </div>
        )}

        {/* subtle scroll hint */}
        {scrollShown && (
          <div
            className="relative z-10 mt-14 flex flex-col items-center transition-all duration-1000 ease-out"
          >
            <div className="w-7 h-7 rounded-full border border-black/10 flex items-center justify-center animate-bounce-slow">
              <span className="text-[11px] leading-none text-black/60" aria-hidden="true">
                ↓
              </span>
            </div>
            <p className="mt-3 text-[0.7rem] text-[#5a5a5a] tracking-[0.35em] uppercase">
              scroll down
            </p>
          </div>
        )}
      </section>

      {/* ============================================================
          2. MEMORIES
          ============================================================ */}
      <section ref={memoriesRef} className="story-panel story-panel--memories relative flex flex-col justify-center px-6">
        <div
          className={`story-reveal max-w-3xl mx-auto transition-all duration-1000 ease-out ${
            memoriesRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          } ${memoriesRevealed ? "is-visible" : ""}`}
        >
          {/* EDIT: replace this paragraph with your own words */}
          <h2 className="font-playfair text-[clamp(2rem,7vw,3.5rem)] font-light tracking-tight leading-none text-foreground mb-10">
            A small note 
          </h2>
          <p className="font-sans text-[clamp(1.1rem,2.4vw,1.4rem)] text-muted leading-relaxed max-w-lg">
            Well, I may not be there right now, but if I could, I'd be right beside you at 11:11, 
            making the same wish and probably smiling at you like an idiot.
            I don't know if 11:11 wishes actually come true, but if they do, I think I've already gotten mine.It's you.
            Happy 11:11 BBG.
          </p>
          <p className="pt-10"> Happy 11:11 bbg.</p>
        </div>
        <div className="mt-12 flex flex-col items-center">
          <div className="w-6 h-6 rounded-full border border-black/10 flex items-center justify-center animate-bounce-slow">
            <span className="text-[9px] leading-none text-black/40" aria-hidden="true">
              ↓
            </span>
          </div>
          <p className="mt-2 text-[0.7rem] text-[#666666] tracking-[0.35em] uppercase">
            scroll down
          </p>
        </div>
      </section>

      {/* ============================================================
          3. PHOTOS — Our Memories
          ============================================================ */}
      <section ref={photosRef} className="story-panel story-panel--photos relative flex flex-col justify-center px-6">
        <div
          className={`story-reveal max-w-5xl mx-auto transition-all duration-1000 ease-out ${
            photosRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          } ${photosRevealed ? "is-visible" : ""}`}
        >
          <h2 className="font-playfair text-[clamp(1.75rem,6vw,2.75rem)] font-light tracking-tight text-foreground mb-14 text-center">
            Some weird aah images for ya, cause i was incapable of thinking more content to add
          </h2>
          <div
            role="region"
            aria-label="Photo memories"
            tabIndex={0}
            data-lenis-prevent
            className="story-carousel story-carousel--stacked flex gap-5 overflow-x-auto pb-5 snap-x snap-mandatory sm:grid sm:grid-cols-3 sm:gap-8 sm:overflow-visible sm:pb-0 max-w-[920px] mx-auto items-start"
          >
            {PHOTOS.map((photo, i) => (
              <div
                key={photo}
                style={{ transitionDelay: `${i * 120}ms` }}
                className="story-item relative w-[min(72vw,290px)] shrink-0 snap-center aspect-[4/5] bg-card border border-border rounded-[9px] rounded-bl-[28px] p-5 pb-14 overflow-hidden group transition duration-500 ease-out hover:border-rose/60 hover:-rotate-[1.5deg] hover:scale-[1.02] sm:w-full"
              >
                <div className="absolute bottom-0 left-6 right-6 h-[26px] bg-card" />
                <Image
                  src={photo}
                  alt={`Memory ${i + 1}`}
                  width={290}
                  height={362}
                  sizes="(max-width: 639px) 90vw, (max-width: 920px) 30vw, 290px"
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8 flex flex-col items-center">
          <div className="w-6 h-6 rounded-full border border-black/10 flex items-center justify-center animate-bounce-slow">
            <span className="text-[9px] leading-none text-black/40" aria-hidden="true">
              ↓
            </span>
          </div>
        </div>
      </section>

      {/* ============================================================
          4. SONGS
          ============================================================ */}
      <section ref={songsRef} className="story-panel story-panel--songs relative flex flex-col justify-center px-6">
        <div
          className={`story-reveal max-w-4xl mx-auto transition-all duration-1000 ease-out ${
            songsRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          } ${songsRevealed ? "is-visible" : ""}`}
        >
          <h2 className="font-playfair text-[clamp(1.75rem,6vw,2.75rem)] font-light tracking-tight text-foreground mb-14 text-center">
            Songs
          </h2>
          <div
            role="region"
            aria-label="Songs"
            tabIndex={0}
            data-lenis-prevent
            className="story-carousel story-carousel--stacked flex gap-5 overflow-x-auto pb-5 snap-x snap-mandatory md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:pb-0 max-w-[860px] mx-auto"
          >
            {SONGS.map((song) => (
              <article
                key={song.id}
                style={{ transitionDelay: `${(song.id - 1) * 120}ms` }}
                className="story-item group w-[min(72vw,290px)] shrink-0 snap-center flex flex-col gap-3 px-5 py-5 bg-card border border-border rounded-2xl transition duration-500 ease-out hover:border-rose/50 hover:bg-[#eaeaea] md:w-full md:px-6 md:py-7"
              >
                <div className="aspect-square relative bg-[#f2f2f2] rounded-xl overflow-hidden">
                  <svg
                    className="w-full h-full"
                    viewBox="0 0 300 300"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    role="img"
                    aria-label={`Original cover art for ${song.title} by ${song.artist}`}
                  >
                    <defs>
                      <linearGradient id={`cover-${song.id}`} x1="0" y1="0" x2="300" y2="300" gradientUnits="userSpaceOnUse">
                        <stop stopColor={song.colors.start} />
                        <stop offset="1" stopColor={song.colors.end} />
                      </linearGradient>
                    </defs>
                    <rect width="300" height="300" rx="10" fill={`url(#cover-${song.id})`} />
                    <circle cx="150" cy="139" r="91" stroke={song.colors.accent} strokeOpacity=".35" />
                    <circle cx="150" cy="139" r="70" stroke={song.colors.accent} strokeOpacity=".55" />
                    <circle cx="150" cy="139" r="48" fill={song.colors.accent} fillOpacity=".14" />
                    <path d="M37 225C96 177 204 178 263 225" stroke={song.colors.accent} strokeOpacity=".55" />
                    <text x="150" y="160" fill={song.colors.accent} fontSize="48" textAnchor="middle">{song.motif}</text>
                    <text x="150" y="249" fill="white" fontFamily="Georgia, serif" fontSize="21" letterSpacing="3" textAnchor="middle">{song.title.toUpperCase()}</text>
                    <text x="150" y="273" fill="white" fillOpacity=".78" fontSize="9" letterSpacing="2" textAnchor="middle">{song.artist.toUpperCase()}</text>
                  </svg>
                  <a
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(`${song.title} ${song.artist}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute right-3 bottom-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-[#5b2333] shadow-lg transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#5b2333]"
                    aria-label={`Search for ${song.title} by ${song.artist} on YouTube`}
                  >
                    <svg aria-hidden="true" viewBox="0 0 24 24" className="ml-0.5 h-5 w-5 fill-current">
                      <path d="M8 5.5v13l10-6.5z" />
                    </svg>
                  </a>
                </div>
                <h3 className="font-playfair text-lg font-light tracking-tight text-foreground leading-none">
                  {song.title}
                </h3>
                <p className="text-sm text-[#666666] tracking-widest uppercase">
                  {song.artist}
                </p>
              </article>
            ))}
          </div>
        </div>
        <div className="mt-8 flex flex-col items-center">
          <div className="w-6 h-6 rounded-full border border-black/10 flex items-center justify-center animate-bounce-slow">
            <span className="text-[9px] leading-none text-black/40" aria-hidden="true">
              ↓
            </span>
          </div>
        </div>
      </section>

      {/* ============================================================
          5. FINAL MESSAGE
          ============================================================ */}
      <section ref={finalRef} className="story-panel story-panel--final relative flex flex-col items-center justify-center text-center px-6">
        <div
          className={`story-reveal transition-all duration-1200 ease-out ${
            finalRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          } ${finalRevealed ? "is-visible" : ""}`}
        >
          <p className="font-playfair text-[clamp(1.5rem,5vw,2.5rem)] font-light leading-relaxed text-foreground max-w-md text-balance mb-3">
            Maybe someday, distance won't matter.
          </p>
          <p className="font-playfair text-[clamp(1.5rem,5vw,2.5rem)] font-light leading-relaxed text-rose max-w-md">
            Till then, HEHEHEHE
          </p>
        </div>
        <div className="mt-14 flex flex-col items-center" aria-hidden="true">
          <div className="text-[34px] text-rose/35 animate-pulse-slow">♡</div>
          <div
            className="mt-6 w-1 h-[6px] bg-rose/20 rounded-full animate-pulse-slow"
            style={{ animationDelay: "1s" }}
          />
        </div>
      </section>
    </div>
  );
}
