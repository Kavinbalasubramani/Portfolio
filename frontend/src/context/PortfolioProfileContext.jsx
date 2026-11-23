import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const PortfolioProfileContext = createContext(null);

export const PortfolioProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    let active = true;
    api.get('/profile')
      .then((body) => {
        const data = body?.data?.data ?? body?.data ?? body;
        if (active && data && typeof data === 'object') setProfile(data);
      })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  return (
    <PortfolioProfileContext.Provider value={profile}>
      {children}
    </PortfolioProfileContext.Provider>
  );
};

export const usePortfolioProfile = () => useContext(PortfolioProfileContext);
