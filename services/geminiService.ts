import { GoogleGenAI, Type } from "@google/genai";
import type { Schedule, Nurse, ShiftType, DayOfWeek } from '../types';

// Assume process.env.API_KEY is available in the environment
const API_KEY = process.env.API_KEY;
if (!API_KEY) {
    throw new Error("API_KEY environment variable not set.");
}
const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    monday: {
      type: Type.OBJECT,
      properties: {
        dayShift: { type: Type.ARRAY, items: { type: Type.STRING } },
        eveningShift: { type: Type.ARRAY, items: { type: Type.STRING } },
        nightShift: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ["dayShift", "eveningShift", "nightShift"]
    },
    tuesday: {
      type: Type.OBJECT,
      properties: {
        dayShift: { type: Type.ARRAY, items: { type: Type.STRING } },
        eveningShift: { type: Type.ARRAY, items: { type: Type.STRING } },
        nightShift: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
       required: ["dayShift", "eveningShift", "nightShift"]
    },
    wednesday: {
      type: Type.OBJECT,
      properties: {
        dayShift: { type: Type.ARRAY, items: { type: Type.STRING } },
        eveningShift: { type: Type.ARRAY, items: { type: Type.STRING } },
        nightShift: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
       required: ["dayShift", "eveningShift", "nightShift"]
    },
    thursday: {
      type: Type.OBJECT,
      properties: {
        dayShift: { type: Type.ARRAY, items: { type: Type.STRING } },
        eveningShift: { type: Type.ARRAY, items: { type: Type.STRING } },
        nightShift: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
       required: ["dayShift", "eveningShift", "nightShift"]
    },
    friday: {
      type: Type.OBJECT,
      properties: {
        dayShift: { type: Type.ARRAY, items: { type: Type.STRING } },
        eveningShift: { type: Type.ARRAY, items: { type: Type.STRING } },
        nightShift: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
       required: ["dayShift", "eveningShift", "nightShift"]
    },
    saturday: {
      type: Type.OBJECT,
      properties: {
        dayShift: { type: Type.ARRAY, items: { type: Type.STRING } },
        eveningShift: { type: Type.ARRAY, items: { type: Type.STRING } },
        nightShift: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
       required: ["dayShift", "eveningShift", "nightShift"]
    },
    sunday: {
      type: Type.OBJECT,
      properties: {
        dayShift: { type: Type.ARRAY, items: { type: Type.STRING } },
        eveningShift: { type: Type.ARRAY, items: { type: Type.STRING } },
        nightShift: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
       required: ["dayShift", "eveningShift", "nightShift"]
    },
  },
   required: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
};

const formatPreferences = (nurses: Nurse[]): string => {
    const preferencesText = nurses
        .map(nurse => {
            const parts = [];
            if (nurse.preferences.preferredShifts.length > 0) {
                const shiftNames = nurse.preferences.preferredShifts.map(s => {
                    if (s === 'dayShift') return '早班';
                    if (s === 'eveningShift') return '中班';
                    return '晚班';
                }).join(', ');
                parts.push(`偏好班別: ${shiftNames}`);
            }
            if (Object.keys(nurse.preferences.unavailableDays).length > 0) {
                 const dayNames = (Object.keys(nurse.preferences.unavailableDays) as DayOfWeek[]).map(d => {
                    const map: Record<DayOfWeek, string> = { monday: '週一', tuesday: '週二', wednesday: '週三', thursday: '週四', friday: '週五', saturday: '週六', sunday: '週日' };
                    const reason = nurse.preferences.unavailableDays[d];
                    return reason ? `${map[d]} (${reason})` : map[d];
                }).join(', ');
                parts.push(`無法排班日: ${dayNames}`);
            }
            return parts.length > 0 ? `- ${nurse.name}: ${parts.join('; ')}` : '';
        })
        .filter(line => line.length > 0)
        .join('\n');

    if (preferencesText.length === 0) {
        return "沒有特定的護理師偏好設定。";
    }

    return `
    Nurse Preferences (Please try to accommodate these as much as possible while respecting all other rules):
    ${preferencesText}
    `;
};


export const generateSchedule = async (nurses: Nurse[]): Promise<Schedule> => {
  const nurseNames = nurses.map(n => n.name);
  const preferencesPrompt = formatPreferences(nurses);

  const prompt = `
    You are an expert hospital ward shift scheduler. Your task is to create a 7-day (Monday to Sunday) nursing schedule for a 24-hour ward.

    Available Nurses:
    ${nurseNames.join(', ')}
    Total nurses: ${nurses.length}

    ${preferencesPrompt}

    Scheduling Rules & Constraints:
    1.  Shifts: There are three 8-hour shifts per day:
        -   Day Shift (早班): 08:00 - 16:00
        -   Evening Shift (中班): 16:00 - 00:00
        -   Night Shift (晚班): 00:00 - 08:00
    2.  Staffing: Each shift must be staffed by at least 2 nurses. If possible, aim for 2-3 nurses per shift.
    3.  Fairness: Distribute shifts as evenly as possible among all available nurses over the week.
    4.  Rest: Every nurse must have at least two full days off during the 7-day period. A day off means they are not assigned to any shift on that day.
    5.  Safety: CRITICAL RULE - A nurse cannot be scheduled for a Day Shift (早班) on the day immediately following a Night Shift (晚班). This is to ensure adequate rest.
    6.  Consistency: Only use the provided nurse names in the schedule. Do not assign a nurse to a day if it is listed as their unavailable day.

    Output Format:
    Provide the output STRICTLY as a JSON object that conforms to the provided schema. Do not include any introductory text, markdown formatting, or explanations. The entire response should be only the valid JSON object.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.8,
      },
    });

    const jsonText = response.text.trim();
    const scheduleData = JSON.parse(jsonText);

    // Basic validation to ensure the structure is correct
    const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    for (const day of days) {
        if (!scheduleData[day] || !scheduleData[day].dayShift || !scheduleData[day].eveningShift || !scheduleData[day].nightShift) {
            throw new Error(`Invalid schedule format: Missing data for ${day}`);
        }
    }

    return scheduleData as Schedule;

  } catch (error) {
    console.error("Gemini API call failed:", error);
    throw new Error("Failed to generate schedule from AI service.");
  }
};