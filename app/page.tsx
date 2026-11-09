"use client";

import { useState, useEffect } from "react";
import Lenis from "lenis";

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
   Songs — replace titles/artists with your own; swap the SVGs
   for real album artwork when you're ready.
   ----------------------------------------------------------------- */
const SONGS = [
  { id: 1, title: "Placeholder song one", artist: "Artist name" },
  { id: 2, title: "Placeholder song two", artist: "Artist name" },
  { id: 3, title: "Placeholder song three", artist: "Artist name" },
];

/* ----------------------------------------------------------------
   Photos — three empty Polaroid-style frames. Replace the SVGs
   with your own image files whenever you like.
   ----------------------------------------------------------------- */
const PHOTO_COUNT = 3;

export default function LoveLetter() {
  const [wishMade, setWishMade] = useState(false);
  const [wishTransitioning, setWishTransitioning] = useState(false);
  const [wishShown, setWishShown] = useState(false);
  const [scrollShown, setScrollShown] = useState(false);

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
            Memories
          </h2>
          <p className="font-sans text-[clamp(1.1rem,2.4vw,1.4rem)] text-muted leading-relaxed max-w-lg">
            Replace this paragraph with your own story — how you met, the little
            things you love about her, the moments you want her to remember.
            This space is entirely yours.
          </p>
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
            Our Memories
          </h2>
          <div
            role="region"
            aria-label="Photo memories, swipe to browse"
            tabIndex={0}
            data-lenis-prevent
            className="story-carousel flex gap-5 overflow-x-auto pb-5 snap-x snap-mandatory sm:grid sm:grid-cols-3 sm:gap-8 sm:overflow-visible sm:pb-0 max-w-[920px] mx-auto items-start"
          >
            {[...Array(PHOTO_COUNT)].map((_, i) => (
              <div
                key={i}
                style={{ transitionDelay: `${i * 120}ms` }}
                className="story-item relative w-[min(72vw,290px)] shrink-0 snap-center aspect-[4/5] bg-card border border-border rounded-[9px] rounded-bl-[28px] p-5 pb-14 overflow-hidden group transition duration-500 ease-out hover:border-rose/60 hover:-rotate-[1.5deg] hover:scale-[1.02] sm:w-full"
              >
                <div
                  className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <span className="text-[10px] text-white/40 tracking-wide uppercase" aria-hidden="true">
                    your photo here
                  </span>
                </div>
                <div className="absolute bottom-0 left-6 right-6 h-[26px] bg-card" />
                {/* EDIT: replace this SVG with <Image src="your-photo.jpg" /> */}
                <svg
                  className="w-full h-full"
                  viewBox="0 0 290 362"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  role="img"
                  aria-label="Empty photo frame"
                >
                  <rect width="290" height="362" fill="#eaeaea" />
                  <circle
                    cx="145"
                    cy="148"
                    r="40"
                    fill="none"
                    stroke="#d4d4d4"
                    strokeWidth={1}
                    opacity={0.6}
                  />
                </svg>
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
            aria-label="Songs, swipe to browse"
            tabIndex={0}
            data-lenis-prevent
            className="story-carousel flex gap-5 overflow-x-auto pb-5 snap-x snap-mandatory md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:pb-0 max-w-[860px] mx-auto"
          >
            {SONGS.map((song) => (
              <article
                key={song.id}
                style={{ transitionDelay: `${(song.id - 1) * 120}ms` }}
                className="story-item group w-[min(72vw,290px)] shrink-0 snap-center flex flex-col gap-3 px-5 py-5 bg-card border border-border rounded-2xl transition duration-500 ease-out hover:border-rose/50 hover:bg-[#eaeaea] md:w-full md:px-6 md:py-7"
              >
                <div className="aspect-square relative bg-[#f2f2f2] rounded-xl overflow-hidden">
                  {/* EDIT: replace this SVG with your album artwork */}
                  <svg
                    className="w-full h-full"
                    viewBox="0 0 300 300"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    role="img"
                    aria-label="Album cover placeholder"
                  >
                    <rect width="300" height="300" fill="#f5f5f5" stroke="#d4d4d4" strokeWidth={1} rx={10} />
                    <circle cx="150" cy="150" r="30" fill="none" stroke="#d4d4d4" strokeWidth={1} opacity={0.4} />
                    <circle cx="150" cy="150" r="4" fill="#999999" />
                  </svg>
                  <button
                    className="absolute right-3 bottom-3 w-8 h-8 rounded-full bg-black/5 backdrop-blur-sm border border-black/10 flex items-center justify-center text-black text-[10px] opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 focus-visible:outline-none"
                    aria-label={`Play ${song.title}`}
                  >
                    ▶
                  </button>
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
            One day, we won't need a website for this.
          </p>
          <p className="font-playfair text-[clamp(1.5rem,5vw,2.5rem)] font-light leading-relaxed text-rose max-w-md">
            Because we'll be together.
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
