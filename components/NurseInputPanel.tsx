import React, { useState } from 'react';
import { UserPlusIcon, TrashIcon, PencilIcon } from './Icons';
import { NursePreferencesModal } from './NursePreferencesModal';
import type { Nurse } from '../types';

interface NurseInputPanelProps {
  nurses: Nurse[];
  setNurses: React.Dispatch<React.SetStateAction<Nurse[]>>;
  onGenerate: () => void;
  isLoading: boolean;
}

export const NurseInputPanel: React.FC<NurseInputPanelProps> = ({ nurses, setNurses, onGenerate, isLoading }) => {
  const [newNurseName, setNewNurseName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNurse, setSelectedNurse] = useState<Nurse | null>(null);

  const handleAddNurse = (e: React.FormEvent) => {
    e.preventDefault();
    if (newNurseName.trim() === '') {
      setError('護理師姓名不能為空。');
      return;
    }
    if (nurses.some(n => n.name === newNurseName.trim())) {
      setError('該護理師已在列表中。');
      return;
    }
    
    const newNurse: Nurse = {
      id: Date.now().toString(),
      name: newNurseName.trim(),
      preferences: { preferredShifts: [], unavailableDays: {} }
    };
    
    setNurses([...nurses, newNurse]);
    setNewNurseName('');
    setError(null);
  };

  const handleRemoveNurse = (idToRemove: string) => {
    setNurses(nurses.filter(nurse => nurse.id !== idToRemove));
  };

  const handleEditPreferences = (nurse: Nurse) => {
    setSelectedNurse(nurse);
    setIsModalOpen(true);
  };

  const handleSavePreferences = (updatedNurse: Nurse) => {
    setNurses(nurses.map(n => n.id === updatedNurse.id ? updatedNurse : n));
    setIsModalOpen(false);
    setSelectedNurse(null);
  };

  return (
    <>
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">控制面板</h2>
        
        <form onSubmit={handleAddNurse} className="mb-6">
          <label htmlFor="nurse-name" className="block text-sm font-medium text-gray-700 mb-1">新增護理師</label>
          <div className="flex items-center space-x-2">
            <input
              id="nurse-name"
              type="text"
              value={newNurseName}
              onChange={(e) => {
                setNewNurseName(e.target.value);
                if (error) setError(null);
              }}
              placeholder="請輸入姓名"
              className="flex-grow block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <UserPlusIcon className="w-5 h-5" />
            </button>
          </div>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </form>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">護理師名單 ({nurses.length})</h3>
          <div className="max-h-60 overflow-y-auto pr-2 -mr-2">
            {nurses.length > 0 ? (
              <ul className="space-y-2">
                {nurses.map((nurse) => (
                  <li key={nurse.id} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                    <span className="text-gray-800">{nurse.name}</span>
                    <div className="flex items-center space-x-2">
                        <button onClick={() => handleEditPreferences(nurse)} className="text-gray-400 hover:text-blue-500 transition-colors" aria-label={`Edit preferences for ${nurse.name}`}>
                            <PencilIcon className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleRemoveNurse(nurse.id)} className="text-gray-400 hover:text-red-500 transition-colors" aria-label={`Remove ${nurse.name}`}>
                            <TrashIcon className="w-5 h-5" />
                        </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">請新增護理師至列表。</p>
            )}
          </div>
        </div>

        <button
          onClick={onGenerate}
          disabled={isLoading || nurses.length === 0}
          className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all transform hover:scale-105"
        >
          {isLoading ? '生成中...' : 'AI 生成排班'}
        </button>
      </div>

      {isModalOpen && selectedNurse && (
        <NursePreferencesModal
            nurse={selectedNurse}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSavePreferences}
        />
      )}
    </>
  );
};