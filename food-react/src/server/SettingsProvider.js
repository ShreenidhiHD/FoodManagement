import React, { useState, useEffect } from 'react';

export const SettingsContext = React.createContext(null);

const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/settings');
        const data = await response.json();
        setSettings(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchSettings();
  }, []);

  if (error) {
    return <div>Error fetching settings: {error}</div>;
  }

  if (!settings) {
    return <div>Loading...</div>;
  }

  return <SettingsContext.Provider value={settings}>{children}</SettingsContext.Provider>;
};




export default SettingsProvider;
