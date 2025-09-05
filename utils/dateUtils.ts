import type { DayOfWeek } from '../types';

const getFirstMondayOfSeptember = (year: number): Date => {
    // Start with September 1st of the given year.
    const date = new Date(year, 8, 1); // month is 0-indexed, so 8 is September.
    
    // Find the first Monday of September.
    // getDay() returns 0 for Sunday, 1 for Monday, ..., 6 for Saturday.
    // We loop until we find a Monday (1).
    while (date.getDay() !== 1) {
        date.setDate(date.getDate() + 1);
    }
    return date;
};

const scheduleDates: Record<DayOfWeek, Date> = (() => {
    const year = new Date().getFullYear();
    const firstMonday = getFirstMondayOfSeptember(year);

    const dates: Partial<Record<DayOfWeek, Date>> = {};
    const daysOfWeekOrder: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    for (let i = 0; i < 7; i++) {
        const currentDate = new Date(firstMonday);
        currentDate.setDate(firstMonday.getDate() + i);
        dates[daysOfWeekOrder[i]] = currentDate;
    }
    return dates as Record<DayOfWeek, Date>;
})();

const formatScheduleDate = (date: Date): string => {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeekNames = ['日', '一', '二', '三', '四', '五', '六'];
    const dayOfWeek = dayOfWeekNames[date.getDay()];
    return `${month}/${day} (${dayOfWeek})`;
};

export const scheduleDateMap: Record<DayOfWeek, string> = {
    monday: formatScheduleDate(scheduleDates.monday),
    tuesday: formatScheduleDate(scheduleDates.tuesday),
    wednesday: formatScheduleDate(scheduleDates.wednesday),
    thursday: formatScheduleDate(scheduleDates.thursday),
    friday: formatScheduleDate(scheduleDates.friday),
    saturday: formatScheduleDate(scheduleDates.saturday),
    sunday: formatScheduleDate(scheduleDates.sunday),
};