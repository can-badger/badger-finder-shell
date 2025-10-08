import Animated from "./Animated.jsx";

export default function AboutSection() {
  return (
      <>
        {/* Sol kart: sadece Hakkımızda + CTA */}
        <Animated as="div" variant="fade-up" delay={0} className="card">
          <div className="section-kicker">Studio</div>
          <h2 style={{ marginTop: 0 }}>Hakkımızda</h2>
          <p>
            YourBrand; tasarım, 3D ve yazılımın kesişiminde deneyim odaklı dijital işler
            üreten bir stüdyo. React ve WebGL (R3F) ile hızlı prototipten prodüksiyona uzanan
            uçtan uca çözümler sunuyoruz. Amaç; markanıza sade, hızlı ve etkileyici
            etkileşimler kazandırmak.
          </p>

          <div className="about-cta">
            <a href="#contact" className="btn">Bizimle çalışın</a>
            <a href="#works" className="btn btn-ghost">İşlerimize bakın</a>
          </div>
        </Animated>

        {/* Sağ kart: Rakamlarla + Çalışma Alanları */}
        <Animated as="div" variant="fade-up" delay={120} className="card">
          <div className="stats">
            <div className="stat">
              <div className="stat-value">2019</div>
              <div className="small">Kuruluş</div>
            </div>
            <div className="stat">
              <div className="stat-value">+120</div>
              <div className="small">Proje</div>
            </div>
            <div className="stat">
              <div className="stat-value">+40</div>
              <div className="small">Müşteri</div>
            </div>
          </div>

          <div className="about-divider" />

          <h3 style={{ marginTop: 0 }}>Çalışma Alanları</h3>
          <div className="chips">
            <span className="chip">Realtime 3D / WebGL (R3F)</span>
            <span className="chip">Etkileşimli Web (React)</span>
            <span className="chip">Marka & Görsel Kimlik</span>
            <span className="chip">Landing & Portfolio</span>
            <span className="chip">AR/VR Prototipleme</span>
            <span className="chip">Mikro Animasyon / Motion</span>
          </div>
        </Animated>
      </>
  );
}
