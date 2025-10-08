// src/components/FinderWindow.jsx
import React, { useMemo, useState } from "react";
import "./finder.css";

/**
 * Props:
 * - title, logo, breadcrumbs, showMiniSwitch, miniOptions, activeMini, onMiniChange
 * - sidebarNav: [{ id, label }]
 * - sections:   [{ id, node }]
 * - defaultActiveId: string   // açılışta gösterilecek section id (örn: "landing")
 * - onSectionChange?: (id) => void
 * - footerLeft, footerRight, searchPlaceholder
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
                                             { id: "info", label: "Info" },
                                         ],
                                         sections = [],
                                         defaultActiveId = "landing",
                                         onSectionChange,
                                         footerLeft = <>© {new Date().getFullYear()} BadgerHouse</>,
                                         footerRight = <>3D • AR • VR • Creative Studio</>,
                                         searchPlaceholder = "Search…",
                                     }) {
    const sectionMap = useMemo(() => {
        const map = new Map();
        sections.forEach(s => map.set(s.id, s.node));
        return map;
    }, [sections]);

    const [activeId, setActiveId] = useState(
        sectionMap.has(defaultActiveId) ? defaultActiveId : sections[0]?.id
    );

    function switchSection(id) {
        if (!sectionMap.has(id)) return;
        setActiveId(id);
        onSectionChange?.(id);
    }

    const ActiveNode = sectionMap.get(activeId) ?? (
        <div className="empty-hint">
            <p>Section not found.</p>
        </div>
    );

    return (
        <div className="finder-wrap theme-badger">
            {/* Titlebar: Logo + Title | sağda sadece Search */}
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

            {/* Toolbar: Breadcrumbs + (opsiyonel) mini segmented switch */}
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

            {/* MainBody: Sidebar (header gibi) + Content (tek section render) */}
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
                    {ActiveNode}
                </section>
            </div>

            {/* StatusBar: footer */}
            <div className="finder-statusbar">
                <span className="status-left">{footerLeft}</span>
                <span className="status-right">{footerRight}</span>
            </div>
        </div>
    );
}
