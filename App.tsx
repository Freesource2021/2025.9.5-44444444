import React, { useState, useCallback } from 'react';
import { NurseInputPanel } from './components/NurseInputPanel';
import { ScheduleDisplay } from './components/ScheduleDisplay';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LoadingSpinner } from './components/LoadingSpinner';
import { generateSchedule } from './services/geminiService';
import type { Schedule, Nurse } from './types';
import { InfoIcon, AlertTriangleIcon } from './components/Icons';

const initialNurses: Nurse[] = [
  { id: '1', name: '王美玲', preferences: { preferredShifts: [], unavailableDays: {} } },
  { id: '2', name: '陳志明', preferences: { preferredShifts: [], unavailableDays: {} } },
  { id: '3', name: '林麗華', preferences: { preferredShifts: [], unavailableDays: {} } },
  { id: '4', name: '黃偉傑', preferences: { preferredShifts: [], unavailableDays: {} } },
  { id: '5', name: '張雅婷', preferences: { preferredShifts: [], unavailableDays: {} } },
  { id: '6', name: '李宗翰', preferences: { preferredShifts: [], unavailableDays: {} } },
  { id: '7', name: '劉芳妤', preferences: { preferredShifts: [], unavailableDays: {} } },
  { id: '8', name: '吳俊彥', preferences: { preferredShifts: [], unavailableDays: {} } },
  { id: '9', name: '蔡宜君', preferences: { preferredShifts: [], unavailableDays: {} } },
  { id: '10', name: '許家豪', preferences: { preferredShifts: [], unavailableDays: {} } },
];


const App: React.FC = () => {
  const [nurses, setNurses] = useState<Nurse[]>(initialNurses);
  const [schedule, setSchedule] = useState<Schedule | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateSchedule = useCallback(async () => {
    if (nurses.length === 0) {
        setError('請至少新增一位護理師。');
        return;
    }
    setIsLoading(true);
    setError(null);
    setSchedule(null);
    try {
      const result = await generateSchedule(nurses);
      setSchedule(result);
    } catch (err) {
      console.error('Error generating schedule:', err);
      setError('無法生成排班表。請稍後再試或檢查您的網路連線。');
    } finally {
      setIsLoading(false);
    }
  }, [nurses]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-1">
            <NurseInputPanel 
              nurses={nurses} 
              setNurses={setNurses} 
              onGenerate={handleGenerateSchedule}
              isLoading={isLoading}
            />
          </div>
          <div className="lg:col-span-2">
             <div className="bg-white p-6 rounded-2xl shadow-lg h-full min-h-[600px] flex flex-col">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">每週排班表</h2>
              {isLoading && (
                <div className="flex flex-col items-center justify-center flex-grow">
                  <LoadingSpinner />
                  <p className="mt-4 text-slate-600 animate-pulse">AI 正在為您排班，請稍候...</p>
                </div>
              )}
              {error && (
                <div className="flex flex-col items-center justify-center flex-grow text-center text-red-600 bg-red-50 p-6 rounded-lg">
                  <AlertTriangleIcon className="w-16 h-16 mb-4" />
                  <p className="font-semibold text-lg">發生錯誤</p>
                  <p>{error}</p>
                </div>
              )}
              {!isLoading && !error && !schedule && (
                 <div className="flex flex-col items-center justify-center flex-grow text-center text-slate-500 bg-slate-50 p-6 rounded-lg">
                  <InfoIcon className="w-16 h-16 mb-4 text-slate-400" />
                  <p className="font-semibold text-lg">尚未生成排班表</p>
                  <p>請在左側面板確認護理師名單，然後點擊「生成排班」按鈕。</p>
                </div>
              )}
              {schedule && <ScheduleDisplay schedule={schedule} nurses={nurses} />}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;