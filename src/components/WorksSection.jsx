// src/components/WorksSection.jsx
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import Animated from "./Animated.jsx";

// Örnek veri (kendi video yollarınla değiştir)
const WORKS = [
  { id: 1, title: "Sky Loop",     client: "Billboard", year: 2024, src: "/videos/sky-loop.mp4" },
  { id: 2, title: "Badger Intro", client: "Badger",    year: 2025, src: "/videos/badger-intro.mp4" },
  { id: 3, title: "Haufen Roast", client: "Haufen",    year: 2023, src: "/videos/haufen-roast.mp4" },
  { id: 4, title: "Neon City",    client: "Internal",  year: 2024, src: "/videos/neon-city.mp4" },
  { id: 5, title: "Grid Reveal",  client: "Showreel",  year: 2025, src: "/videos/grid-reveal.mp4" },
];

export default function WorksSection() {
  const [expanded, setExpanded] = useState(false); // grid açık mı?
  const [index, setIndex] = useState(0);           // tek iş modundaki index
  const [filter, setFilter] = useState("Tümü");

  // Modal: grid/tek iş görünümünden açılan index
  const [modalIndex, setModalIndex] = useState(null); // number | null
  const modalWork = useMemo(
      () => (modalIndex == null ? null : filtered[modalIndex] || null),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [modalIndex] // filtered aşağıda tanımlı; dependency trick için effect'le güvence veriyoruz
  );

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const clients = useMemo(() => ["Tümü", ...Array.from(new Set(WORKS.map(w => w.client)))], []);
  const filtered = useMemo(
      () => (filter === "Tümü" ? WORKS : WORKS.filter(w => w.client === filter)),
      [filter]
  );
  const total = filtered.length;
  const current = filtered[index] || filtered[0];

  // Filtre değişince veya liste kısalınca index'i güvene al
  useEffect(() => {
    if (index > total - 1) setIndex(0);
  }, [index, total]);

  // Tek iş modunda ve modal kapalıyken ok tuşlarıyla gezin
  useEffect(() => {
    if (expanded || modalWork) return;
    function onKey(e) {
      if (e.key === "ArrowRight") setIndex(i => (i + 1) % total);
      if (e.key === "ArrowLeft")  setIndex(i => (i - 1 + total) % total);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expanded, total, modalWork]);

  // Modal açıkken: Esc ile kapan, ←/→ ile modal içinde gezin
  const lastFocusedRef = useRef(null);
  const closeBtnRef = useRef(null);

  useEffect(() => {
    if (modalWork == null) return;
    function onKey(e) {
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowRight") modalNext();
      if (e.key === "ArrowLeft")  modalPrev();
      if (e.key === "Tab") { // basit focus-trap
        e.preventDefault();
        closeBtnRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    // body scroll'u kilitle
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // close button'a focus ver
    setTimeout(() => closeBtnRef.current?.focus(), 0);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [modalWork]);

  // filtered listesi değişince modalIndex'i de güvene al
  useEffect(() => {
    if (modalIndex == null) return;
    if (modalIndex > total - 1) setModalIndex(total ? 0 : null);
  }, [modalIndex, total]);

  const prev = useCallback(() => setIndex(i => (i - 1 + total) % total), [total]);
  const next = useCallback(() => setIndex(i => (i + 1) % total), [total]);

  const openGrid = useCallback(() => setExpanded(true), []);
  const closeGrid = useCallback(() => setExpanded(false), []);

  const openModalByIndex = useCallback((i) => {
    lastFocusedRef.current = document.activeElement;
    setModalIndex(i);
  }, []);
  const openModalCurrent = useCallback(() => {
    const i = Math.max(0, filtered.findIndex(w => w.id === current?.id));
    openModalByIndex(i === -1 ? 0 : i);
  }, [filtered, current, openModalByIndex]);

  const closeModal = useCallback(() => {
    setModalIndex(null);
    // focus'u geri ver
    setTimeout(() => {
      if (lastFocusedRef.current && lastFocusedRef.current.focus) {
        lastFocusedRef.current.focus();
      }
    }, 0);
  }, []);

  const modalPrev = useCallback(() => {
    if (!total) return;
    setModalIndex(i => (i == null ? 0 : (i - 1 + total) % total));
  }, [total]);

  const modalNext = useCallback(() => {
    if (!total) return;
    setModalIndex(i => (i == null ? 0 : (i + 1) % total));
  }, [total]);

  // Grid hover/focus video önizleme (bandwidth dostu)
  function handleTileEnter(e) {
    if (prefersReducedMotion) return;
    const v = e.currentTarget.querySelector("video");
    if (v) { v.muted = true; v.play().catch(() => {}); }
  }
  function handleTileLeave(e) {
    const v = e.currentTarget.querySelector("video");
    if (v) { v.pause(); try { v.currentTime = 0; } catch {} }
  }

  return (
      <div className="works-shell">
        <Animated as="div" variant="fade-in" delay={0} className="section-kicker">Portfolio</Animated>
        <Animated as="h2"  variant="fade-up" delay={60} style={{ marginTop: 0 }}>İşlerimiz</Animated>

        {/* Toolbar */}
        <Animated as="div" variant="fade-up" delay={120} className="works-toolbar">
          <label className="small" htmlFor="clientFilter">Müşteri</label>
          <select
              id="clientFilter"
              value={filter}
              onChange={(e) => { setFilter(e.target.value); setIndex(0); }}
          >
            {clients.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <div className="spacer" />
          {!expanded ? (
              <button className="btn" onClick={openGrid}>Tüm İşleri Göster</button>
          ) : (
              <button className="btn" onClick={closeGrid}>Kapat</button>
          )}
        </Animated>

        {/* Boş durum */}
        {!total && (
            <div className="card small" role="status" aria-live="polite">
              Bu filtrede içerik bulunamadı.
            </div>
        )}

        {/* Tek iş modu */}
        {!expanded && total > 0 && current && (
            <Animated as="div" variant="scale-in" delay={160} className="work-stage card">
              <button aria-label="Önceki iş" className="stage-arrow left" onClick={prev}>‹</button>
              <button aria-label="Sonraki iş" className="stage-arrow right" onClick={next}>›</button>

              <div className="stage-media" onClick={openModalCurrent}>
                <video
                    key={current.id}
                    src={current.src}
                    className="stage-video"
                    playsInline
                    muted
                    preload="metadata"
                    // reduce motion kapalıysa teaser olarak automatische oynat
                    {...(!prefersReducedMotion ? { autoPlay: true, loop: true } : {})}
                />
                <div className="stage-overlay">
                  <div className="stage-meta">
                    <div className="stage-title">{current.title}</div>
                    <div className="stage-sub">{current.client} • {current.year}</div>
                  </div>
                  <div className="stage-hint small">Tıkla → Pop-up</div>
                </div>
              </div>
            </Animated>
        )}

        {/* Grid modu — tek kapsayıcı, kare kutular */}
        {expanded && total > 0 && (
            <div className="work-grid one-container">
              {filtered.map((w, i) => (
                  <Animated
                      key={w.id}
                      as="div"
                      variant="scale-in"
                      delay={i * 60}
                      className="tile"
                      role="button"
                      tabIndex={0}
                      onClick={() => openModalByIndex(i)}
                      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") openModalByIndex(i); }}
                      onMouseEnter={handleTileEnter}
                      onMouseLeave={handleTileLeave}
                      onFocus={handleTileEnter}
                      onBlur={handleTileLeave}
                      aria-label={`${w.title} (${w.client} • ${w.year})`}
                  >
                    <video
                        src={w.src}
                        playsInline
                        muted
                        preload="metadata" // grid'de daha ekonomik
                    />
                    <div className="tile-caption">
                      <div className="tile-title">{w.title}</div>
                      <div className="small">{w.client} • {w.year}</div>
                    </div>
                  </Animated>
              ))}
            </div>
        )}

        {/* Modal */}
        {modalWork && (
            <div
                className="video-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                onClick={(e) => { if (e.currentTarget === e.target) closeModal(); }}
            >
              <div className="modal-inner">
                <button
                    ref={closeBtnRef}
                    className="modal-close"
                    onClick={closeModal}
                    aria-label="Kapat"
                >
                  ×
                </button>

                <div className="modal-video-wrap">
                  <video
                      key={modalWork.id}
                      src={modalWork.src}
                      playsInline
                      controls
                      autoPlay={!prefersReducedMotion}
                      className="modal-video"
                  />
                </div>

                <div className="modal-caption">
                  <div id="modal-title" className="modal-title">{modalWork.title}</div>
                  <div className="small">{modalWork.client} • {modalWork.year}</div>
                  <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                    <button className="btn-ghost" onClick={modalPrev} aria-label="Önceki">‹</button>
                    <button className="btn-ghost" onClick={modalNext} aria-label="Sonraki">›</button>
                  </div>
                </div>
              </div>
            </div>
        )}
      </div>
  );
}
