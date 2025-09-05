import React from 'react';
import Header from './components/Header';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-center p-10">
      <Header />
      <h1 className="text-3xl font-bold text-blue-600 mt-10">
        AI 護理排班系統
      </h1>
      <p className="mt-4 text-gray-600">歡迎使用智慧排班工具</p>
    </div>
  );
};

export default App;
