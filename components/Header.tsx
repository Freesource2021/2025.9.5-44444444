
import React from 'react';
import { StethoscopeIcon } from './Icons';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 md:px-8 py-4 flex items-center">
        <StethoscopeIcon className="w-8 h-8 text-blue-600" />
        <h1 className="ml-3 text-2xl font-bold text-gray-800 tracking-tight">
          AI 護理病房排班系統
        </h1>
        <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
          Gemini Powered
        </span>
      </div>
    </header>
  );
};
