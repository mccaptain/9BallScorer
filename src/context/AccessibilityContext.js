import { createContext, useContext, useEffect, useState } from 'react';
import { light, dark } from './theme';

const SIZES = { S: 1.3, M: 1.6, L: 2.0 };
const STORAGE_KEY = 'apa-scorer-accessibility';

function load(key) {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem(key);
  } catch { return null; }
}

function save(key, val) {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(key, val); } catch {}
}

const AccessibilityContext = createContext();

export function AccessibilityProvider({ children }) {
  const [textSize, setTextSize] = useState(() => load(STORAGE_KEY + '-textSize') || 'S');
  const [ballSize, setBallSize] = useState(() => load(STORAGE_KEY + '-ballSize') || 'S');
  const [darkMode, setDarkMode] = useState(() => load(STORAGE_KEY + '-darkMode') === 'true');

  useEffect(() => { save(STORAGE_KEY + '-textSize', textSize); }, [textSize]);
  useEffect(() => { save(STORAGE_KEY + '-ballSize', ballSize); }, [ballSize]);
  useEffect(() => { save(STORAGE_KEY + '-darkMode', String(darkMode)); }, [darkMode]);

  const theme = darkMode ? dark : light;

  return (
    <AccessibilityContext.Provider value={{ textSize, setTextSize, ballSize, setBallSize, darkMode, setDarkMode, textScale: SIZES[textSize], ballScale: SIZES[ballSize], theme }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  return useContext(AccessibilityContext);
}
