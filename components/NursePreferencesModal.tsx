import React, { useState, useEffect } from 'react';
import type { Nurse, NursePreferences, ShiftType, DayOfWeek } from '../types';
import { XIcon } from './Icons';
import { scheduleDateMap } from '../utils/dateUtils';

interface NursePreferencesModalProps {
  nurse: Nurse;
  onSave: (updatedNurse: Nurse) => void;
  onClose: () => void;
}

const shiftOptions: { id: ShiftType; label: string }[] = [
  { id: 'dayShift', label: '早班' },
  { id: 'eveningShift', label: '中班' },
  { id: 'nightShift', label: '晚班' },
];

const dayOptions: { id: DayOfWeek; label: string }[] = (Object.keys(scheduleDateMap) as DayOfWeek[]).map(day => ({
    id: day,
    label: scheduleDateMap[day],
}));

export const NursePreferencesModal: React.FC<NursePreferencesModalProps> = ({ nurse, onSave, onClose }) => {
  const [preferences, setPreferences] = useState<NursePreferences>(nurse.preferences);

  const handleShiftChange = (shift: ShiftType) => {
    setPreferences(prev => {
      const newShifts = prev.preferredShifts.includes(shift)
        ? prev.preferredShifts.filter(s => s !== shift)
        : [...prev.preferredShifts, shift];
      return { ...prev, preferredShifts: newShifts };
    });
  };
  
  const handleDayChange = (day: DayOfWeek) => {
    setPreferences(prev => {
      const newUnavailableDays = { ...prev.unavailableDays };
      if (newUnavailableDays[day] !== undefined) {
        delete newUnavailableDays[day];
      } else {
        newUnavailableDays[day] = ''; // Add with empty reason
      }
      return { ...prev, unavailableDays: newUnavailableDays };
    });
  };

  const handleReasonChange = (day: DayOfWeek, reason: string) => {
      setPreferences(prev => ({
          ...prev,
          unavailableDays: {
              ...prev.unavailableDays,
              [day]: reason,
          }
      }));
  };

  const handleSaveChanges = () => {
    onSave({ ...nurse, preferences });
  };
  
  // Handle Escape key press
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);


  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div 
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg transform transition-all"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h2 id="modal-title" className="text-xl font-bold text-gray-800">
                編輯 <span className="text-blue-600">{nurse.name}</span> 的偏好
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Close modal">
                <XIcon className="w-6 h-6" />
            </button>
        </div>
        
        <div className="space-y-6">
            <div>
                <h3 className="text-md font-semibold text-gray-700 mb-2">偏好班別 (可複選)</h3>
                <div className="grid grid-cols-3 gap-2">
                    {shiftOptions.map(({ id, label }) => (
                        <label key={id} className={`flex items-center space-x-2 p-2 rounded-md border cursor-pointer ${preferences.preferredShifts.includes(id) ? 'bg-blue-50 border-blue-400' : 'bg-gray-50 border-gray-200'}`}>
                            <input
                                type="checkbox"
                                checked={preferences.preferredShifts.includes(id)}
                                onChange={() => handleShiftChange(id)}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-800">{label}</span>
                        </label>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="text-md font-semibold text-gray-700 mb-2">無法排班日 (可複選並註記)</h3>
                <div className="space-y-2">
                     {dayOptions.map(({ id, label }) => {
                        const isUnavailable = preferences.unavailableDays[id] !== undefined;
                        return (
                            <div key={id} className={`p-2 rounded-md border flex items-center gap-2 ${isUnavailable ? 'bg-red-50 border-red-300' : 'bg-gray-50 border-gray-200'}`}>
                                <input
                                    type="checkbox"
                                    id={`day-${id}`}
                                    checked={isUnavailable}
                                    onChange={() => handleDayChange(id)}
                                    className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                                />
                                <label htmlFor={`day-${id}`} className="text-sm text-gray-800 cursor-pointer w-24">{label}</label>
                                {isUnavailable && (
                                     <input
                                        type="text"
                                        value={preferences.unavailableDays[id]}
                                        onChange={(e) => handleReasonChange(id, e.target.value)}
                                        placeholder="原因 (選填)"
                                        className="flex-grow block w-full px-2 py-1 bg-white border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    />
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>

        <div className="mt-8 flex justify-end space-x-3">
            <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                取消
            </button>
            <button
                type="button"
                onClick={handleSaveChanges}
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
                儲存變更
            </button>
        </div>
      </div>
    </div>
  );
};