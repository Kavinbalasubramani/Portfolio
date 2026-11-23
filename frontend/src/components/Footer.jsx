import { ArrowUp, Mail, MapPin, Phone } from 'lucide-react';
import { Github, Linkedin } from './BrandIcons';
import { usePortfolioProfile } from '../context/PortfolioProfileContext';

const Footer = () => {
  const profile = usePortfolioProfile();
  const name = profile?.name || 'Kavin B';
  const logo = profile?.brand_logo?.trim() || name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase();
  const email = profile?.email || 'kavinkbs2202@gmail.com';
  const phoneDigits = (profile?.phone || '').replace(/\D/g, '');
  // Admin profile accepts a local Indian mobile number or an international number.
  const whatsappNumber = phoneDigits.length === 10 ? `91${phoneDigits}` : phoneDigits;
  const whatsappHref = whatsappNumber.length >= 11 && whatsappNumber.length <= 15
    ? `https://wa.me/${whatsappNumber}`
    : null;

  return (
    <footer className="relative isolate overflow-hidden border-t border-slate-200 bg-slate-50 text-slate-600 transition-colors dark:border-white/10 dark:bg-[#08071b] dark:text-slate-400">
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-36 h-80 w-80 rounded-full bg-violet-600/10 blur-3xl" />
      <div className="relative mx-auto w-full px-[clamp(20px,5vw,96px)] pb-7 pt-12 sm:pt-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.25fr_.8fr_1fr] lg:gap-16">
          <div className="space-y-5">
            <a href="#home" className="group flex w-fit items-center gap-3" aria-label={`${name} home`}>
              <span className="inline-flex h-12 min-w-12 max-w-32 items-center justify-center truncate rounded-2xl border border-violet-400/30 bg-gradient-to-br from-violet-500/20 to-blue-500/10 px-3 font-heading text-sm font-extrabold text-violet-700 shadow-lg shadow-violet-950/10 transition-transform group-hover:-translate-y-0.5 dark:text-violet-200">{logo}</span>
              <span>
                <span className="block font-heading text-lg font-bold text-slate-900 dark:text-white">{name}</span>
                <span className="block text-sm">{profile?.title || 'Full Stack Developer'}</span>
              </span>
            </a>
            <p className="max-w-md text-sm leading-6">{profile?.bio || 'Building thoughtful web experiences and reliable applications.'}</p>
            <div className="flex items-center gap-2.5">
              {profile?.github_url && <a href={profile.github_url} target="_blank" rel="noreferrer" aria-label="GitHub" className="footer-social"><Github /></a>}
              {profile?.linkedin_url && <a href={profile.linkedin_url} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="footer-social"><Linkedin /></a>}
              {whatsappHref && <a href={whatsappHref} target="_blank" rel="noreferrer" aria-label={`Chat with ${name} on WhatsApp`} className="footer-social footer-whatsapp"><WhatsAppIcon /></a>}
              <a href={`mailto:${email}`} aria-label={`Email ${name}`} className="footer-social"><Mail className="h-4 w-4" /></a>
            </div>
          </div>

          <nav aria-label="Footer navigation">
            <h2 className="mb-4 text-xs font-bold uppercase tracking-[.18em] text-slate-900 dark:text-slate-200">Explore</h2>
            <ul className="grid grid-cols-2 gap-x-5 gap-y-3 text-sm md:grid-cols-1">
              {['About', 'Skills', 'Projects', 'Experience', 'Services', 'Contact'].map((item) => (
                <li key={item}><a href={`#${item.toLowerCase()}`} className="transition-colors hover:text-violet-600 dark:hover:text-violet-300">{item}</a></li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="mb-4 text-xs font-bold uppercase tracking-[.18em] text-slate-900 dark:text-slate-200">Get in touch</h2>
            <div className="space-y-3 text-sm">
              <a href={`mailto:${email}`} className="flex items-center gap-3 transition-colors hover:text-violet-600 dark:hover:text-violet-300"><span className="footer-contact-icon"><Mail className="h-4 w-4" /></span>{email}</a>
              {profile?.phone && <a href={`tel:${profile.phone.replace(/[^+\d]/g, '')}`} className="flex items-center gap-3 transition-colors hover:text-violet-600 dark:hover:text-violet-300"><span className="footer-contact-icon"><Phone className="h-4 w-4" /></span>{profile.phone}</a>}
              {whatsappHref && <a href={whatsappHref} target="_blank" rel="noreferrer" className="group flex w-fit items-center gap-3 rounded-full border border-emerald-500/25 bg-emerald-500/5 py-1.5 pr-4 text-emerald-700 transition-colors hover:border-emerald-500/50 hover:bg-emerald-500/10 dark:text-emerald-300" aria-label={`Start a WhatsApp chat with ${name}`}><span className="footer-contact-icon footer-whatsapp-icon"><WhatsAppIcon /></span><span>Message me on WhatsApp</span></a>}
              {profile?.location && <span className="flex items-center gap-3"><span className="footer-contact-icon"><MapPin className="h-4 w-4" /></span>{profile.location}</span>}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-slate-200 pt-5 text-xs text-slate-500 dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} {name}. All rights reserved.</p>
          <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="group inline-flex w-fit items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2.5 font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-violet-400 hover:text-violet-700 hover:shadow-lg hover:shadow-violet-900/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-200 dark:hover:border-violet-400/50 dark:hover:text-violet-200">
            Back to top <ArrowUp className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-1" />
          </button>
        </div>
      </div>
    </footer>
  );
};

function WhatsAppIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]">
      <path d="M20.52 3.48A11.86 11.86 0 0 0 12.06 0C5.47 0 .1 5.36.1 11.95c0 2.1.55 4.15 1.6 5.96L0 24l6.25-1.64a11.93 11.93 0 0 0 5.8 1.48h.01c6.59 0 11.95-5.36 11.95-11.95 0-3.2-1.24-6.2-3.49-8.41ZM12.06 21.8h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.71.97.99-3.61-.24-.37a9.87 9.87 0 0 1-1.52-5.25c0-5.46 4.45-9.9 9.91-9.9a9.83 9.83 0 0 1 7.01 2.9 9.83 9.83 0 0 1 2.9 7.01c0 5.46-4.45 9.9-9.93 9.9Zm5.44-7.42c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.66.15-.2.3-.76.97-.93 1.17-.17.2-.34.22-.63.07-.3-.15-1.26-.46-2.4-1.46-.9-.8-1.5-1.77-1.67-2.07-.17-.3-.02-.46.13-.6.13-.13.3-.34.44-.51.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.07-.15-.66-1.6-.9-2.19-.24-.57-.48-.49-.66-.5h-.56c-.2 0-.51.07-.78.37-.27.3-1.02 1-1.02 2.44s1.05 2.83 1.2 3.02c.15.2 2.07 3.16 5.02 4.43.7.3 1.25.48 1.68.61.7.22 1.34.19 1.84.11.56-.08 1.76-.72 2-1.42.24-.7.24-1.3.17-1.42-.07-.13-.27-.2-.56-.35Z" />
    </svg>
  );
}

export default Footer;
