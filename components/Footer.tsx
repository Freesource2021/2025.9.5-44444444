
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white mt-8">
      <div className="container mx-auto px-4 md:px-8 py-4 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} AI Nursing Ward Scheduler. All Rights Reserved.</p>
      </div>
    </footer>
  );
};
