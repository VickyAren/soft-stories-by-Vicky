
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useData } from '../context/DataContext';
import AdSensePlaceholder from '../components/AdSensePlaceholder';

const HomePage: React.FC = () => {
  const { data, loading } = useData();

  if (loading || !data) {
    return <div>Loading...</div>;
  }

  const { home, settings } = data;

  return (
    <Layout>
      {/* Hero Section */}
      <section className="text-center py-20 md:py-32 bg-soft-beige">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-6xl font-serif text-soft-text leading-tight">
            {home.heroText}
          </h1>
          <p className="text-2xl md:text-4xl font-serif text-soft-text/70 mt-4">
            {home.tagline}
          </p>
          <Link to={home.buttonLink} className="mt-12 inline-block bg-soft-accent text-white px-10 py-3 rounded-full font-sans font-semibold text-lg hover:bg-soft-brown transition-colors shadow-md">
            {home.buttonText}
          </Link>
        </div>
      </section>

      {/* AdSense Placeholder */}
      <div className="container mx-auto px-6">
        <AdSensePlaceholder 
          isEnabled={settings.adsense.homeEnabled}
          scriptCode={settings.adsense.scriptCode}
        />
      </div>

      {/* Support Section */}
      <section className="py-16 bg-white/30">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="bg-soft-beige/50 p-8 rounded-lg border border-soft-accent/20">
              <h2 className="text-2xl font-serif text-soft-brown mb-4">Support a New Writer</h2>
              <p className="text-soft-text/80 text-lg leading-relaxed">{home.supportWriterText}</p>
            </div>
          </div>
        </div>
      </section>

    </Layout>
  );
};

export default HomePage;