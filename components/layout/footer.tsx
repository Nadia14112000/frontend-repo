import Image from 'next/image';
import Link from 'next/link';

const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <footer
      className="relative bg-black text-white"
      style={{
        backgroundImage: "url('/footer-background.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Overlay sombre pour rendre le texte plus lisible */}
      <div className="absolute inset-0 bg-black opacity-80"></div>

      <div className="relative mx-auto max-w-7xl px-6 py-12">
        {/* Logo + À propos */}
        <div className="mb-8 flex flex-col items-center text-center">
          <Image src="/logo.png" alt="Ooredoo Logo" width={150} height={50} />
          <h2 className="mt-4 text-lg font-bold">À PROPOS DE NOUS</h2>
        </div>

        {/* Sections du footer */}
        <div className="grid grid-cols-1 gap-8 text-center sm:grid-cols-2 md:grid-cols-4 md:text-left">
          {/* Colonne Particulier */}
          <div>
            <h3 className="text-lg font-semibold">PARTICULIER</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/accueil" className="hover:underline">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/mobile" className="hover:underline">
                  Mobile
                </Link>
              </li>
              <li>
                <Link href="/internet" className="hover:underline">
                  Internet
                </Link>
              </li>
              <li>
                <Link href="/self-service" className="hover:underline">
                  Self-service
                </Link>
              </li>
              <li>
                <Link href="/assistance" className="hover:underline">
                  Assistance
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne Professionnel */}
          <div>
            <h3 className="text-lg font-semibold">PROFESSIONNEL</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/accueil" className="hover:underline">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/pme-pmi" className="hover:underline">
                  PME-PMI
                </Link>
              </li>
              <li>
                <Link href="/entreprises" className="hover:underline">
                  Entreprises
                </Link>
              </li>
              <li>
                <Link href="/assistance" className="hover:underline">
                  Assistance
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne Infos Utiles */}
          <div>
            <h3 className="text-lg font-semibold">INFOS UTILES</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/contact" className="hover:underline">
                  Nous contacter
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:underline">
                  À propos de nous
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:underline">
                  Données personnelles
                </Link>
              </li>
              <li>
                <Link href="/report" className="hover:underline">
                  Signalement
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne My Ooredoo App */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold">MY OOREEDOO APP</h3>
            <div className="mt-4 space-y-2">
              <Link href="https://apps.apple.com" target="_blank">
                <Image src="/app_store.png" alt="App Store" width={150} height={50} />
              </Link>
              <Link href="https://play.google.com" target="_blank">
                <Image src="/google play.png" alt="Google Play" width={150} height={50} />
              </Link>
              <Link href="https://appgallery.huawei.com" target="_blank">
                <Image src="/huawei.png" alt="App Gallery" width={150} height={50} />
              </Link>
            </div>
          </div>
        </div>

        {/* Lignes et icônes sociales */}
        <div className="relative mt-8 flex flex-col items-center justify-between border-t border-gray-700 pt-6 md:flex-row">
          <p className="text-center text-sm md:text-left">
            &copy; {currentYear} Ooredoo. Tous droits réservés.
          </p>

          {/* Icônes sociales */}
          <div className="mt-4 flex space-x-4 md:mt-0">
            <Link href="https://facebook.com" target="_blank">
              <Image src="/facebook.png" alt="Facebook" width={24} height={24} />
            </Link>
            <Link href="https://x.com/" target="_blank">
              <Image src="/twitter.png" alt="Twitter" width={24} height={24} />
            </Link>
            <Link href="https://youtube.com" target="_blank">
              <Image src="/youtube.png" alt="YouTube" width={24} height={24} />
            </Link>
            <Link href="https://pinterest.com" target="_blank">
              <Image src="/pinterest.png" alt="Pinterest" width={24} height={24} />
            </Link>
            <Link href="https://www.instagram.com/" target="_blank">
              <Image src="/instagram.png" alt="Instagram" width={24} height={24} />
            </Link>
            <Link href="https://linkedin.com" target="_blank">
              <Image src="/linkedin.png" alt="LinkedIn" width={24} height={24} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
