
import React from 'react';
import Layout from '../components/Layout';
import { useData } from '../context/DataContext';
import BookCard from '../components/BookCard';
import AdSensePlaceholder from '../components/AdSensePlaceholder';

const BooksPage: React.FC = () => {
  const { data, loading } = useData();

  if (loading || !data) {
    return <div>Loading...</div>;
  }

  const { books, settings } = data;
  const booksWithAd = [...books];
  // Insert an ad placeholder after the 2nd book, if there are enough books
  if (books.length > 2) {
    booksWithAd.splice(2, 0, 'adsense-placeholder' as any);
  }


  return (
    <Layout>
      <div className="container mx-auto px-6 py-16">
        <h1 className="text-4xl md:text-5xl font-serif text-center text-soft-brown mb-12">My Books</h1>
        
        {books.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {booksWithAd.map((item, index) => {
              if (typeof item === 'string' && item === 'adsense-placeholder') {
                return (
                  <div key="adsense" className="sm:col-span-2 lg:col-span-3">
                    <AdSensePlaceholder 
                      isEnabled={settings.adsense.booksEnabled}
                      scriptCode={settings.adsense.scriptCode}
                    />
                  </div>
                );
              }
              const book = item;
              return <BookCard key={book.id} book={book} />;
            })}
          </div>
        ) : (
          <p className="text-center text-soft-text/70">No books have been added yet.</p>
        )}
      </div>
    </Layout>
  );
};

export default BooksPage;
