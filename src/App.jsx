import LandingSection from './components/LandingSection.jsx'
import AboutSection from './components/AboutSection.jsx'
import WorksSection from './components/WorksSection.jsx'
import ContactSection from './components/ContactSection.jsx'
import SiteFooter from './components/SiteFooter.jsx'
import logoUrl from '../public/assets/logo.svg'


export default function App(){
  return (
    <>
      <header className="topnav">
        <div className="navwrap">
          {/* header içinde soldaki logo alanın */}
          <a href="#landing" className="logo" aria-label="Anasayfa">
            <img src={logoUrl} alt="Badger House" />
          </a>


          <nav className="navlinks small">
            <a href="#about">Hakkımızda</a>
            <a href="#works">İşler</a>
            <a href="#contact">İletişim</a>
          </nav>
        </div>
      </header>

      <main>
        <section id="landing" style={{padding:0}}>
          <LandingSection />
        </section>

        <section id="about">
          <div className="container grid grid-2">
            <AboutSection />
          </div>
        </section>

        <section id="works">
          <div className="container">
            <WorksSection />
          </div>
        </section>

        <section id="contact">
          <div className="container">
            <ContactSection />
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <SiteFooter />
        </div>
      </footer>
    </>
  )

}