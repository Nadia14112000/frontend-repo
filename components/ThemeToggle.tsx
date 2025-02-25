'use client';

import { useEffect, useState } from 'react';
import { FiMoon, FiSun } from 'react-icons/fi';

const ThemeToggle = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    console.log('Stored theme in localStorage:', storedTheme);
    console.log('System prefers dark:', prefersDark);

    let activeTheme: 'light' | 'dark' = 'light';

    if (storedTheme) {
      activeTheme = storedTheme as 'light' | 'dark';
    } else {
      activeTheme = prefersDark ? 'dark' : 'light';
    }

    setTheme(activeTheme);
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(activeTheme);

    console.log('Applied theme on <html>:', document.documentElement.classList);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);

    // Supprimer toutes les classes puis ajouter la bonne
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(newTheme);

    console.log('Toggled theme to:', newTheme);
    console.log('Final <html> classList:', document.documentElement.classList);
  };

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-5 right-5 rounded-full bg-gray-200 p-3 shadow-lg transition-all dark:bg-gray-800"
    >
      {theme === 'light' ? <FiMoon size={24} /> : <FiSun size={24} />}
    </button>
  );
};

export default ThemeToggle;
