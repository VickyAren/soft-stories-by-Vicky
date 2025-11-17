
import React, { useState } from 'react';
import { Book } from '../types';
import PurchaseLinksModal from './PurchaseLinksModal';

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="bg-white/50 rounded-lg shadow-lg overflow-hidden flex flex-col group transition-transform duration-300 hover:scale-105">
        <div className="aspect-[2/3] overflow-hidden">
          <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover group-hover:opacity-90 transition-opacity" />
        </div>
        <div className="p-6 flex-grow flex flex-col">
          <h3 className="text-2xl font-serif font-semibold text-soft-brown mb-2">{book.title}</h3>
          <p className="text-soft-text/80 mb-4 flex-grow">{book.description}</p>
          <div className="flex justify-between items-center mt-auto pt-4 border-t border-soft-accent/20">
            <span className="text-xl font-sans font-semibold text-soft-brown">${book.price.toFixed(2)}</span>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-soft-accent text-white px-6 py-2 rounded-full font-sans font-semibold hover:bg-soft-brown transition-colors"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
      <PurchaseLinksModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        links={book.purchaseLinks}
        bookTitle={book.title}
      />
    </>
  );
};

export default BookCard;
