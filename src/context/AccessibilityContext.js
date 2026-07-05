import { createContext, useContext, useEffect, useState } from 'react';
import { green, monokai, dark } from './theme';

const SIZES = { S: 1.3, M: 1.6, L: 2.0 };
const STORAGE_KEY = 'apa-scorer-accessibility';

const THEMES = { green, monokai, dark };

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
  const [themeKey, setThemeKey] = useState(() => load(STORAGE_KEY + '-theme') || 'green');

  useEffect(() => { save(STORAGE_KEY + '-textSize', textSize); }, [textSize]);
  useEffect(() => { save(STORAGE_KEY + '-ballSize', ballSize); }, [ballSize]);
  useEffect(() => { save(STORAGE_KEY + '-theme', themeKey); }, [themeKey]);

  const theme = THEMES[themeKey] || green;

  return (
    <AccessibilityContext.Provider value={{ textSize, setTextSize, ballSize, setBallSize, themeKey, setThemeKey, textScale: SIZES[textSize], ballScale: SIZES[ballSize], theme }}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  return useContext(AccessibilityContext);
}
