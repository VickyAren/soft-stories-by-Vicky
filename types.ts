
export interface PurchaseLinks {
  [key: string]: string;
  amazon: string;
  gumroad: string;
  etsy: string;
}

export interface Book {
  id: string;
  title: string;
  description: string;
  price: number;
  coverImage: string; // base64 string or URL
  purchaseLinks: PurchaseLinks;
}

export interface HomePageContent {
  heroText: string;
  tagline: string;
  supportWriterText: string;
  buttonText: string;
  buttonLink: string;
}

export interface AboutPageContent {
  bio: string;
  imageUrl: string; // base64 string or URL
  purposeText: string;
}

export interface AdSenseSettings {
  homeEnabled: boolean;
  aboutEnabled: boolean;
  booksEnabled: boolean;
  scriptCode: string;
}

export interface GeneralSettings {
  siteLogo: string; // text or base64 image string
  navHome: string;
  navAbout: string;
  navBooks: string;
  footerInstagramLink: string;
  footerCopyright: string;
  theme: {
    beige: string;
    brown: string;
    text: string;
    accent: string;
  }
}

export interface WebsiteData {
  home: HomePageContent;
  about: AboutPageContent;
  books: Book[];
  settings: {
    general: GeneralSettings;
    adsense: AdSenseSettings;
  };
}