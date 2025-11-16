
import React from 'react';
import { PurchaseLinks } from '../types';

interface PurchaseLinksModalProps {
  isOpen: boolean;
  onClose: () => void;
  links: PurchaseLinks;
  bookTitle: string;
}

const PurchaseLinksModal: React.FC<PurchaseLinksModalProps> = ({ isOpen, onClose, links, bookTitle }) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <div className="bg-soft-beige rounded-lg shadow-2xl p-8 max-w-sm w-full font-sans animate-fade-in">
        <h3 className="text-xl font-serif font-semibold text-soft-brown mb-2">Purchase "{bookTitle}"</h3>
        <p className="text-soft-text/80 mb-6">Select a platform to buy from:</p>
        <div className="space-y-3">
          {Object.entries(links).map(([platform, url]) => (
            url && (
              <a
                key={platform}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-white/70 py-3 px-4 rounded-lg text-soft-brown font-semibold hover:bg-soft-accent hover:text-white transition-all capitalize"
              >
                {platform}
              </a>
            )
          ))}
        </div>
        <button
          onClick={onClose}
          className="mt-6 w-full text-center py-2 text-soft-text/70 hover:text-soft-brown"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default PurchaseLinksModal;
