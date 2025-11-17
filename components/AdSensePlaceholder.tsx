
import React from 'react';

interface AdSensePlaceholderProps {
  isEnabled: boolean;
  scriptCode: string;
}

const AdSensePlaceholder: React.FC<AdSensePlaceholderProps> = ({ isEnabled, scriptCode }) => {
  if (!isEnabled) {
    return null;
  }

  return (
    <div className="my-8 flex justify-center items-center">
      <div className="w-full max-w-4xl p-4 bg-gray-200/50 border border-dashed border-gray-400/50 rounded-lg text-center text-gray-500">
        <div dangerouslySetInnerHTML={{ __html: scriptCode }} />
        <p className="font-sans text-sm mt-2">Ad Placeholder</p>
      </div>
    </div>
  );
};

export default AdSensePlaceholder;
