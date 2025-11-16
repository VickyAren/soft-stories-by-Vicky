
import React from 'react';
import Layout from '../components/Layout';
import { useData } from '../context/DataContext';
import AdSensePlaceholder from '../components/AdSensePlaceholder';

const AboutPage: React.FC = () => {
  const { data, loading } = useData();

  if (loading || !data) {
    return <div>Loading...</div>;
  }

  const { about, settings } = data;

  return (
    <Layout>
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif text-center text-soft-brown mb-12">About Vicky Aran</h1>
          
          <div className="grid md:grid-cols-3 gap-8 md:gap-12 items-start">
            <div className="md:col-span-1">
              <img src={about.imageUrl} alt="Vicky Aran" className="rounded-lg shadow-lg w-full"/>
            </div>
            <div className="md:col-span-2 space-y-6 text-lg text-soft-text/90 leading-relaxed">
              <p>{about.bio}</p>
            </div>
          </div>

          <div className="mt-16 pt-12 border-t border-soft-accent/20">
            <h2 className="text-3xl font-serif text-center text-soft-brown mb-8">Why I Write Soft Stories</h2>
            <div className="max-w-3xl mx-auto text-center text-lg text-soft-text/80 leading-relaxed">
              <p>{about.purposeText}</p>
            </div>
          </div>

          <AdSensePlaceholder 
            isEnabled={settings.adsense.aboutEnabled}
            scriptCode={settings.adsense.scriptCode}
          />
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;
