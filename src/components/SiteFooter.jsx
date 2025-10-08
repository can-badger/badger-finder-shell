// Logon src/assets içindeyse import et (yolunu durumuna göre düzelt)
import logoUrl from '../../public/assets/white_text.svg';

export default function SiteFooter(){
  return (
      <div className="ftr-stage">
        {/* Sol üst: Logo */}
        <a href="#landing" className="ftr-logo-link" aria-label="Anasayfa">
          <img src={logoUrl} alt="Badger House" className="ftr-logo" />
        </a>

        {/* Sağ alt: Bilgiler */}
        <div className="ftr-info">
          <div className="ftr-h">Adres</div>
          <div className="small">İstanbul • TR</div>

          <div className="ftr-h">E-mail</div>
          <a className="small" href="mailto:hello@badgerhouse.com">hello@badgerhouse.com</a>

          <div className="small ftr-copy">© 2025 Badger House — Tüm hakları saklıdır.</div>
        </div>
      </div>
  );
}
