import { usePortfolioProfile } from '../context/PortfolioProfileContext';

const FloatingWhatsApp = () => {
  const profile = usePortfolioProfile();
  const phoneDigits = (profile?.phone || '').replace(/\D/g, '');
  const whatsappNumber = phoneDigits.length === 10 ? `91${phoneDigits}` : phoneDigits;

  if (whatsappNumber.length < 11 || whatsappNumber.length > 15) return null;

  return (
    <a
      className="floating-whatsapp"
      href={`https://wa.me/${whatsappNumber}`}
      target="_blank"
      rel="noreferrer"
      aria-label={`Chat with ${profile?.name || 'me'} on WhatsApp`}
      title="Chat on WhatsApp"
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7">
        <path d="M20.52 3.48A11.86 11.86 0 0 0 12.06 0C5.47 0 .1 5.36.1 11.95c0 2.1.55 4.15 1.6 5.96L0 24l6.25-1.64a11.93 11.93 0 0 0 5.8 1.48h.01c6.59 0 11.95-5.36 11.95-11.95 0-3.2-1.24-6.2-3.49-8.41ZM12.06 21.8h-.01a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.71.97.99-3.61-.24-.37a9.87 9.87 0 0 1-1.52-5.25c0-5.46 4.45-9.9 9.91-9.9a9.83 9.83 0 0 1 7.01 2.9 9.83 9.83 0 0 1 2.9 7.01c0 5.46-4.45 9.9-9.93 9.9Zm5.44-7.42c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.66.15-.2.3-.76.97-.93 1.17-.17.2-.34.22-.63.07-.3-.15-1.26-.46-2.4-1.46-.9-.8-1.5-1.77-1.67-2.07-.17-.3-.02-.46.13-.6.13-.13.3-.34.44-.51.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.07-.15-.66-1.6-.9-2.19-.24-.57-.48-.49-.66-.5h-.56c-.2 0-.51.07-.78.37-.27.3-1.02 1-1.02 2.44s1.05 2.83 1.2 3.02c.15.2 2.07 3.16 5.02 4.43.7.3 1.25.48 1.68.61.7.22 1.34.19 1.84.11.56-.08 1.76-.72 2-1.42.24-.7.24-1.3.17-1.42-.07-.13-.27-.2-.56-.35Z" />
      </svg>
      <span className="sr-only">Chat with me</span>
    </a>
  );
};

export default FloatingWhatsApp;
