import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FloatingWhatsApp from '../components/FloatingWhatsApp';
import { PortfolioProfileProvider, usePortfolioProfile } from '../context/PortfolioProfileContext';
import { applyTheme, getSavedTheme } from '../utils/theme';

const PublicLayout = () => {
  useEffect(() => {
    applyTheme(getSavedTheme());
  }, []);

  return (
    <PortfolioProfileProvider>
      <ProfileFavicon />
      <div className="min-h-screen premium-public">
        <Navbar />
        <main className="premium-main">
          <Outlet />
        </main>
        <Footer />
        <FloatingWhatsApp />
      </div>
    </PortfolioProfileProvider>
  );
};

const ProfileFavicon = () => {
  const profile = usePortfolioProfile();

  useEffect(() => {
    const initials = (profile?.brand_logo?.trim() || profile?.name?.trim() || 'KB')
      .replace(/\.$/, '')
      .replace(/[^a-z0-9]/gi, '')
      .slice(0, 2)
      .toUpperCase() || 'KB';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#8b5cf6"/><stop offset="1" stop-color="#2563eb"/></linearGradient></defs><rect width="64" height="64" rx="18" fill="#0b0920"/><rect x="4" y="4" width="56" height="56" rx="15" fill="url(#g)"/><text x="32" y="41" text-anchor="middle" font-family="Arial,sans-serif" font-size="25" font-weight="700" fill="white">${initials}</text></svg>`;
    const faviconUrl = `data:image/svg+xml,${encodeURIComponent(svg)}`;
    let favicon = document.querySelector('link[rel~="icon"]');
    if (!favicon) {
      favicon = document.createElement('link');
      favicon.rel = 'icon';
      document.head.appendChild(favicon);
    }
    favicon.type = 'image/svg+xml';
    favicon.href = faviconUrl;
  }, [profile?.brand_logo, profile?.name]);

  return null;
};

export default PublicLayout;
