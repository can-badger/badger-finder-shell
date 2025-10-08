// src/App.jsx
import FinderWindow from "./components/FinderWindow.jsx";
import LandingSection from "./components/LandingSection.jsx";
import AboutSection from "./components/AboutSection.jsx";      // Info
import WorksSection from "./components/WorksSection.jsx";      // opsiyonel
import ContactSection from "./components/ContactSection.jsx";  // opsiyonel

export default function App(){
    const sections = [
        { id: "landing", node: <LandingSection /> },
        { id: "info",    node: <AboutSection /> },
        { id: "works",   node: <WorksSection /> },
        { id: "contact", node: <ContactSection /> },
    ];

    return (
        <section >
            <FinderWindow
                title="BadgerHouse — 3D Creative Studio"
                breadcrumbs={["BadgerHouse", "Website"]}
                sidebarNav={[
                    { id: "landing", label: "Home" },
                    { id: "info", label: "Info" },
                    { id: "works", label: "Works" },
                    { id: "contact", label: "Contact" },
                ]}
                sections={sections}
                defaultActiveId="landing"   // açılışta LandingSection
                showMiniSwitch={false}      // ileride true yaparsın
            />
        </section>
    );
}
