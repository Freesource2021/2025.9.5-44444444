import React from 'react';
import type { Schedule, DayOfWeek, DailySchedule, Nurse } from '../types';
import { scheduleDateMap } from '../utils/dateUtils';
import { UserOffIcon } from './Icons';


const shiftMapping: Record<keyof DailySchedule, { name: string; time: string; color: string }> = {
  dayShift: { name: '早班', time: '08-16', color: 'bg-sky-100 text-sky-800' },
  eveningShift: { name: '中班', time: '16-00', color: 'bg-amber-100 text-amber-800' },
  nightShift: { name: '晚班', time: '00-08', color: 'bg-indigo-100 text-indigo-800' },
};

interface OffDutyNurse {
    name: string;
    // FIX: Changed reason to be optional to align with the updated `NursePreferences` type.
    // This prevents a potential type error when `unavailableDays[day]` is `undefined`.
    reason: string | undefined;
}

const DayColumn: React.FC<{ day: DayOfWeek; data: DailySchedule; offDutyNurses: OffDutyNurse[] }> = ({ day, data, offDutyNurses }) => {
    const isWeekend = day === 'saturday' || day === 'sunday';
    return (
        <div className={`flex-1 min-w-[150px] flex flex-col ${isWeekend ? 'bg-slate-50' : ''}`}>
            <div className={`p-2 font-bold text-center text-gray-700 border-b-2 border-gray-200 ${isWeekend ? 'text-blue-600' : ''}`}>
                {scheduleDateMap[day]}
            </div>
            <div className="flex-grow">
                {(Object.keys(shiftMapping) as Array<keyof DailySchedule>).map(shiftKey => (
                    <div key={shiftKey} className="p-3 border-b border-gray-100 min-h-[120px] flex flex-col">
                        <div className="flex justify-between items-baseline mb-2">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${shiftMapping[shiftKey].color}`}>
                                {shiftMapping[shiftKey].name}
                            </span>
                            <span className="text-xs text-gray-400">{shiftMapping[shiftKey].time}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                            {data[shiftKey].length > 0 ? data[shiftKey].map((name, index) => (
                                <span key={index} className="px-2 py-1 bg-white border border-gray-200 text-gray-700 text-sm rounded-md">
                                    {name}
                                </span>
                            )) : <span className="text-sm text-gray-400 italic">無人</span>}
                        </div>
                    </div>
                ))}
            </div>
            {offDutyNurses.length > 0 && (
                <div className="p-3 border-t border-gray-200 bg-gray-50">
                    <h4 className="text-xs font-bold text-gray-500 mb-2 flex items-center">
                        <UserOffIcon className="w-4 h-4 mr-1.5" />
                        請假備註
                    </h4>
                    <ul className="space-y-1">
                        {offDutyNurses.map(nurse => (
                            <li key={nurse.name} className="text-xs text-gray-600 truncate">
                                <span className="font-medium">{nurse.name}:</span> {nurse.reason || '休息'}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

interface ScheduleDisplayProps {
  schedule: Schedule;
  nurses: Nurse[];
}

export const ScheduleDisplay: React.FC<ScheduleDisplayProps> = ({ schedule, nurses }) => {
  return (
    <div className="overflow-x-auto">
        <div className="flex border border-gray-200 rounded-lg bg-white">
            {(Object.keys(scheduleDateMap) as DayOfWeek[]).map(day => {
                const offDutyNurses = nurses
                    .filter(nurse => nurse.preferences.unavailableDays[day] !== undefined)
                    .map(nurse => ({
                        name: nurse.name,
                        reason: nurse.preferences.unavailableDays[day]
                    }));

                return <DayColumn key={day} day={day} data={schedule[day]} offDutyNurses={offDutyNurses} />;
            })}
        </div>
    </div>
  );
};