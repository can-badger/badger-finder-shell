import { useEffect, useMemo, useRef, useState } from "react";
import Animated from "./Animated.jsx";

// Örnek veri (kendi video yollarınla değiştir)
const WORKS = [
  { id: 1, title: 'Sky Loop',      client: 'Billboard', year: 2024, src: '/videos/sky-loop.mp4' },
  { id: 2, title: 'Badger Intro',  client: 'Badger',    year: 2025, src: '/videos/badger-intro.mp4' },
  { id: 3, title: 'Haufen Roast',  client: 'Haufen',    year: 2023, src: '/videos/haufen-roast.mp4' },
  { id: 4, title: 'Neon City',     client: 'Internal',  year: 2024, src: '/videos/neon-city.mp4' },
  { id: 5, title: 'Grid Reveal',   client: 'Showreel',  year: 2025, src: '/videos/grid-reveal.mp4' },
];

export default function WorksSection(){
  const [expanded, setExpanded] = useState(false);
  const [index, setIndex] = useState(0);
  const [filter, setFilter] = useState('Tümü');
  const [modalWork, setModalWork] = useState(null);

  const clients = useMemo(()=> ['Tümü', ...Array.from(new Set(WORKS.map(w => w.client)))], []);
  const filtered = useMemo(() => filter === 'Tümü' ? WORKS : WORKS.filter(w => w.client === filter), [filter]);
  const total = filtered.length;
  const current = filtered[index] || filtered[0];

  useEffect(()=>{ if(index > filtered.length - 1) setIndex(0) }, [filtered, index]);

  // ok tuşları (tek iş modunda ve modal kapalıyken)
  useEffect(()=>{
    if(expanded || modalWork) return;
    function onKey(e){
      if(e.key === 'ArrowRight') setIndex(i => (i + 1) % total);
      if(e.key === 'ArrowLeft')  setIndex(i => (i - 1 + total) % total);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [expanded, total, modalWork]);

  function prev(){ setIndex(i => (i - 1 + total) % total) }
  function next(){ setIndex(i => (i + 1) % total) }

  function openGrid(){ setExpanded(true) }
  function closeGrid(){ setExpanded(false) }

  function openModal(work){ setModalWork(work) }
  function closeModal(){ setModalWork(null) }

  useEffect(()=>{
    if(!modalWork) return;
    function onKey(e){ if(e.key === 'Escape') closeModal() }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [modalWork]);

  return (
      <div className="works-shell">
        <Animated as="div" variant="fade-in" delay={0} className="section-kicker">Portfolio</Animated>
        <Animated as="h2"  variant="fade-up" delay={60} style={{marginTop:0}}>İşlerimiz</Animated>

        {/* Toolbar */}
        <Animated as="div" variant="fade-up" delay={120} className="works-toolbar">
          <label className="small" htmlFor="clientFilter">Müşteri</label>
          <select id="clientFilter" value={filter} onChange={(e)=>{ setFilter(e.target.value); setIndex(0); }}>
            {clients.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <div className="spacer" />
          {!expanded ? (
              <button className="btn" onClick={openGrid}>Tüm İşleri Göster</button>
          ) : (
              <button className="btn" onClick={closeGrid}>Kapat</button>
          )}
        </Animated>

        {/* Tek iş modu */}
        {!expanded && current && (
            <Animated as="div" variant="scale-in" delay={160} className="work-stage card">
              <button aria-label="Önceki iş" className="stage-arrow left" onClick={prev}>‹</button>
              <button aria-label="Sonraki iş" className="stage-arrow right" onClick={next}>›</button>

              <div className="stage-media" onClick={()=> openModal(current)}>
                <video
                    key={current.id}
                    src={current.src}
                    className="stage-video"
                    playsInline
                    muted
                    controls={false}
                    preload="metadata"
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
        {expanded && (
            <div className="work-grid one-container">
              {filtered.map((w, i)=> (
                  <Animated
                      key={w.id}
                      as="div"
                      variant="scale-in"
                      delay={i * 60}
                      className="tile"
                      onClick={()=> openModal(w)}
                  >
                    <video
                        src={w.src}
                        playsInline
                        muted
                        controls={false}
                        preload="metadata"
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
            <div className="video-modal" role="dialog" aria-modal="true" onClick={(e)=>{ if(e.currentTarget === e.target) closeModal() }}>
              <div className="modal-inner">
                <button className="modal-close" onClick={closeModal} aria-label="Kapat">×</button>
                <div className="modal-video-wrap">
                  <video
                      key={modalWork.id}
                      src={modalWork.src}
                      playsInline
                      controls
                      autoPlay
                      className="modal-video"
                  />
                </div>
                <div className="modal-caption">
                  <div className="modal-title">{modalWork.title}</div>
                  <div className="small">{modalWork.client} • {modalWork.year}</div>
                </div>
              </div>
            </div>
        )}
      </div>
  );
}
