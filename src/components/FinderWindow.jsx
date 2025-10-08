// src/components/FinderWindow.jsx
import React, { useMemo, useState, useEffect, useCallback } from "react";
import "./finder.css";

/**
 * Yeni URL senkron props:
 * - urlSync?: boolean            // URL ile senkron (default: true)
 * - urlMode?: "query" | "hash"   // ?tab=info veya #info (default: "query")
 * - urlKey?: string              // query anahtarı (default: "tab")
 * - replaceOnSwitch?: boolean    // history replace vs push (default: true)
 *
 * Diğer tüm props öncekiyle aynı.
 */
export default function FinderWindow({
                                         title = "BadgerHouse — 3D Creative Studio",
                                         logo = null,
                                         breadcrumbs = ["BadgerHouse", "Website"],
                                         showMiniSwitch = false,
                                         miniOptions = ["Home", "Portfolio", "Careers"],
                                         activeMini,
                                         onMiniChange,
                                         sidebarNav = [
                                             { id: "landing", label: "Home" },
                                             { id: "info",    label: "Info" },
                                         ],
                                         sections = [],
                                         defaultActiveId = "landing",
                                         onSectionChange,
                                         footerLeft = <>© {new Date().getFullYear()} BadgerHouse</>,
                                         footerRight = <>3D • AR • VR • Creative Studio</>,
                                         searchPlaceholder = "Search…",

                                         // boyut/uyarlanabilirlik (öncekilerle aynı)
                                         barScale = 1.18,
                                         sidebarMin = "170px",
                                         sidebarMax = "280px",
                                         sidebarVw  = "15vw",

                                         // URL senkron
                                         urlSync = true,
                                         urlMode = "query",            // "query" | "hash"
                                         urlKey = "tab",
                                         replaceOnSwitch = true,       // replaceState (true) ya da pushState (false)

                                         // görsel
                                         transition = true,
                                         transitionMs = 160,
                                     }) {
    const sectionMap = useMemo(() => {
        const map = new Map();
        sections.forEach(s => map.set(s.id, s.node));
        return map;
    }, [sections]);

    // ————— URL yardımcıları —————
    const getIdFromURL = useCallback(() => {
        if (typeof window === "undefined") return null;
        if (urlMode === "hash") {
            const raw = (window.location.hash || "").replace(/^#/, "");
            return raw || null;
        } else {
            const sp = new URLSearchParams(window.location.search);
            return sp.get(urlKey);
        }
    }, [urlMode, urlKey]);

    const setIdInURL = useCallback((id) => {
        if (typeof window === "undefined") return;
        const url = new URL(window.location.href);
        if (urlMode === "hash") {
            url.hash = `#${id}`;
        } else {
            url.searchParams.set(urlKey, id);
        }
        if (replaceOnSwitch) {
            window.history.replaceState(null, "", url.toString());
        } else {
            window.history.pushState(null, "", url.toString());
        }
    }, [urlMode, urlKey, replaceOnSwitch]);

    // ————— initial state —————
    const computeInitialId = useCallback(() => {
        if (urlSync) {
            const fromURL = getIdFromURL();
            if (fromURL && sectionMap.has(fromURL)) return fromURL;
        }
        if (sectionMap.has(defaultActiveId)) return defaultActiveId;
        return sections[0]?.id;
    }, [urlSync, getIdFromURL, sectionMap, defaultActiveId, sections]);

    const [activeId, setActiveId] = useState(computeInitialId);
    const [animKey, setAnimKey] = useState(0);

    // URL’de sekme yoksa açılışta yaz
    useEffect(() => {
        if (!urlSync) return;
        const fromURL = getIdFromURL();
        if (!fromURL && activeId) setIdInURL(activeId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // sadece mount

    // back/forward için dinleyici
    useEffect(() => {
        if (!urlSync) return;
        const handler = () => {
            const id = getIdFromURL();
            if (id && sectionMap.has(id)) {
                setActiveId(id);
                setAnimKey(k => k + 1);
                onSectionChange?.(id);
            }
        };
        const eventName = urlMode === "hash" ? "hashchange" : "popstate";
        window.addEventListener(eventName, handler);
        return () => window.removeEventListener(eventName, handler);
    }, [urlSync, urlMode, getIdFromURL, sectionMap, onSectionChange]);

    // sekme değiştir
    const switchSection = useCallback((id) => {
        if (!sectionMap.has(id)) return;
        setActiveId(id);
        setAnimKey(k => k + 1);
        onSectionChange?.(id);
        if (urlSync) setIdInURL(id);
    }, [sectionMap, onSectionChange, urlSync, setIdInURL]);

    // klavye ↑↓
    const onKeyDown = useCallback((e) => {
        if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
        e.preventDefault();
        const ids = sidebarNav.map(s => s.id);
        const idx = Math.max(0, ids.indexOf(activeId));
        const nextIdx = e.key === "ArrowDown"
            ? (idx + 1) % ids.length
            : (idx - 1 + ids.length) % ids.length;
        switchSection(ids[nextIdx]);
    }, [activeId, sidebarNav, switchSection]);

    const ActiveNode = sectionMap.get(activeId) ?? (
        <div className="empty-hint"><p>Section not found.</p></div>
    );

    const styleVars = {
        ["--bar-scale"]: barScale,
        ["--sidebar-min"]: sidebarMin,
        ["--sidebar-max"]: sidebarMax,
        ["--sidebar-vw"]:  sidebarVw,
        ["--content-fade-ms"]: `${transitionMs}ms`,
    };

    return (
        <div
            className="finder-wrap theme-badger"
            style={styleVars}
            onKeyDown={onKeyDown}
            tabIndex={0}
        >
            {/* Titlebar */}
            <div className="finder-titlebar" style={{ gridTemplateColumns: "1fr auto" }}>
                <div className="title">
                    {typeof logo === "string" ? (
                        <img src={logo} alt="logo" className="title-logo" />
                    ) : (logo || <span className="title-glow-dot" />)}
                    {title}
                </div>
                <div className="titlebar-actions">
                    <div className="search"><input placeholder={searchPlaceholder} /></div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="finder-toolbar">
                <div className="crumbs">
                    {breadcrumbs.map((c, i) => (
                        <React.Fragment key={i}>
                            <span className={`crumb ${i === breadcrumbs.length - 1 ? "active" : ""}`}>{c}</span>
                            {i < breadcrumbs.length - 1 && <span className="chev">›</span>}
                        </React.Fragment>
                    ))}
                </div>

                {showMiniSwitch && (
                    <div className="toolbar-buttons">
                        <div className="tool seg-mini">
                            {miniOptions.map(opt => (
                                <button
                                    key={opt}
                                    className={`seg-mini-btn ${activeMini === opt ? "active" : ""}`}
                                    onClick={() => onMiniChange?.(opt)}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* MainBody */}
            <div className="finder-body">
                <aside className="finder-sidebar">
                    <div className="sb-group">
                        <div className="sb-title">Navigation</div>
                        {sidebarNav.map(item => (
                            <button
                                key={item.id}
                                className={`sb-item ${item.id === activeId ? "active" : ""}`}
                                onClick={() => switchSection(item.id)}
                            >
                                <span className="sb-dot" />
                                {item.label}
                            </button>
                        ))}
                    </div>
                </aside>

                <section className="finder-content content-panel">
                    <div key={animKey} className={transition ? "content-fade-in" : undefined}>
                        {ActiveNode}
                    </div>
                </section>
            </div>

            {/* Footer */}
            <div className="finder-statusbar">
                <span className="status-left">{footerLeft}</span>
                <span className="status-right">{footerRight}</span>
            </div>
        </div>
    );
}
