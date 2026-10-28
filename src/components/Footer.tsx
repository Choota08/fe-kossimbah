import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        {/* TOP */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* BRAND */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
             <div className="bg-[#081426] text-primary-foreground">
                <img
                  src="/image/logoowl.png"
                  alt="KosSimbah Logo"
                  className="w-8 h-8"
                />
              </div>
              <span className="font-serif font-semibold text-xl">
                Kos<span className="text-[#ffffff]">Simbah</span>
              </span>
            </div>

            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              Platform penyewaan kos terpercaya dengan pilihan kamar berkualitas
              di berbagai kota di Indonesia.
            </p>

            <div className="flex gap-4">
              <a
                href="#"
                aria-label="Facebook"
                className="text-primary-foreground/70 hover:text-gold transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="text-primary-foreground/70 hover:text-gold transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="text-primary-foreground/70 hover:text-gold transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* NAVIGASI */}
          <div className="space-y-4">
            <h4 className="font-serif font-semibold text-lg">Navigasi</h4>
            <ul className="flex flex-col gap-2 text-sm">
              <li>
                <Link
                  to="/"
                  className="text-primary-foreground/70 hover:text-gold transition-colors"
                >
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  to="/kos"
                  className="text-primary-foreground/70 hover:text-gold transition-colors"
                >
                  Cari Kos
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="text-primary-foreground/70 hover:text-gold transition-colors"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* DUKUNGAN */}
          <div className="space-y-4">
            <h4 className="font-serif font-semibold text-lg">Dukungan</h4>
            <ul className="flex flex-col gap-2 text-sm">
              <li>
                <a
                  href="#"
                  className="text-primary-foreground/70 hover:text-gold transition-colors"
                >
                  Pusat Bantuan
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-primary-foreground/70 hover:text-gold transition-colors"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-primary-foreground/70 hover:text-gold transition-colors"
                >
                  Kebijakan Privasi
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-primary-foreground/70 hover:text-gold transition-colors"
                >
                  Syarat & Ketentuan
                </a>
              </li>
            </ul>
          </div>

          {/* KONTAK */}
          <div className="space-y-4">
            <h4 className="font-serif font-semibold text-lg">Kontak</h4>
            <div className="flex flex-col gap-3 text-sm">
              <a
                href="tel:+6281234567890"
                className="flex items-center gap-2 text-primary-foreground/70 hover:text-gold transition-colors"
              >
                <Phone className="w-4 h-4" />
                +62 812 3456 7890
              </a>

              <a
                href="mailto:info@kossimbah.com"
                className="flex items-center gap-2 text-primary-foreground/70 hover:text-gold transition-colors"
              >
                <Mail className="w-4 h-4" />
                info@kossimbah.com
              </a>

              <div className="flex items-start gap-2 text-primary-foreground/70">
                <MapPin className="w-4 h-4 mt-0.5" />
                Malang, Indonesia
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="border-t border-primary-foreground/10 mt-10 pt-6 text-center">
          <p className="text-primary-foreground/50 text-sm">
            © {new Date().getFullYear()} KosSimbah. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
