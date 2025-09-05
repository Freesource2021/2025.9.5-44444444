export type ShiftAssignments = string[];

export interface DailySchedule {
  dayShift: ShiftAssignments;
  eveningShift: ShiftAssignments;
  nightShift: ShiftAssignments;
}

export interface Schedule {
  monday: DailySchedule;
  tuesday: DailySchedule;
  wednesday: DailySchedule;
  thursday: DailySchedule;
  friday: DailySchedule;
  saturday: DailySchedule;
  sunday: DailySchedule;
}

export type DayOfWeek = keyof Schedule;
export type ShiftType = keyof DailySchedule;

export interface NursePreferences {
    preferredShifts: ShiftType[];
    /** A record where the key is the day of the week and the value is the reason for unavailability. */
    // FIX: Changed to Partial<Record> to allow a nurse to have no unavailable days.
    // This resolves errors where `unavailableDays` was initialized as an empty object.
    unavailableDays: Partial<Record<DayOfWeek, string>>;
}

export interface Nurse {
    id: string;
    name: string;
    preferences: NursePreferences;
}