
import React, { createContext, useState, useEffect, useContext, ReactNode, useCallback } from 'react';
import { WebsiteData } from '../types';

const defaultData: WebsiteData = {
  home: {
    heroText: "To the ones who feel too much —",
    tagline: "you're not alone. Stories can heal, gently.",
    supportWriterText: "Your support helps a new writer continue to create stories that touch the heart. Every book purchased is a step towards another story being told.",
    buttonText: "Explore Books",
    buttonLink: "/books",
  },
  about: {
    bio: "Vicky Aran is a writer of soft, emotional stories. She finds magic in the quiet moments and believes in the healing power of words. Her writing is a gentle embrace for the overthinkers and the dreamers, a reminder that vulnerability is a strength.",
    imageUrl: 'https://picsum.photos/seed/vicky/400/500',
    purposeText: "I write because I believe stories are medicine. They allow us to step into another's shoes, to feel seen in our own quiet struggles, and to find hope in the gentle unfolding of a narrative. My purpose is to create a soft space for readers to land, to reflect, and to heal."
  },
  books: [
    {
      id: "windows-of-change-1",
      title: 'Windows of Change',
      description: 'A 44-page emotional and reflective short story about healing, growth, resilience, and gentle transformation—told through the metaphor of windows and everyday moments.',
      price: 2.99,
      coverImage: 'https://picsum.photos/seed/book1/400/600',
      purchaseLinks: {
        amazon: "https://amazon.com",
        gumroad: "https://gumroad.com",
        etsy: "https://etsy.com",
      }
    }
  ],
  settings: {
    general: {
      siteLogo: "Soft Stories by Vicky",
      navHome: "Home",
      navAbout: "About",
      navBooks: "Books",
      footerInstagramLink: "https://www.instagram.com/softstoriesbyvicky?igsh=d2duejRnejlsN3hm",
      footerCopyright: `© ${new Date().getFullYear()} Vicky Aran. All Rights Reserved.`,
      theme: {
        beige: '#F5F5DC',
        brown: '#A0522D',
        text: '#5D4037',
        accent: '#D2B48C',
      }
    },
    adsense: {
      homeEnabled: true,
      aboutEnabled: true,
      booksEnabled: true,
      scriptCode: '<!-- Google AdSense: Insert your AdSense script here -->',
    }
  }
};

interface DataContextType {
  data: WebsiteData | null;
  setData: (data: WebsiteData) => void;
  loading: boolean;
}

const DataContext = createContext<DataContextType>({
  data: null,
  setData: () => {},
  loading: true,
});

export const useData = () => useContext(DataContext);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setDataState] = useState<WebsiteData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem('websiteData');
      if (storedData) {
        setDataState(JSON.parse(storedData));
      } else {
        setDataState(defaultData);
        localStorage.setItem('websiteData', JSON.stringify(defaultData));
      }
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
      setDataState(defaultData);
    }
    setLoading(false);
  }, []);

  // Listen for changes in localStorage from other tabs
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'websiteData' && event.newValue) {
        try {
          setDataState(JSON.parse(event.newValue));
        } catch (error) {
          console.error("Failed to parse updated data from localStorage", error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const setData = useCallback((newData: WebsiteData) => {
    setDataState(newData);
    try {
      localStorage.setItem('websiteData', JSON.stringify(newData));
    } catch (error) {
      console.error("Failed to save data to localStorage", error);
    }
  }, []);

  useEffect(() => {
    if (data) {
      const { theme } = data.settings.general;
      const root = document.documentElement;
      root.style.setProperty('--color-soft-beige', theme.beige);
      root.style.setProperty('--color-soft-brown', theme.brown);
      root.style.setProperty('--color-soft-text', theme.text);
      root.style.setProperty('--color-soft-accent', theme.accent);
    }
  }, [data]);

  return (
    <DataContext.Provider value={{ data, setData, loading }}>
      {children}
    </DataContext.Provider>
  );
};
