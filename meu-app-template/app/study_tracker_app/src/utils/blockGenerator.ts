import { StudyBlock } from '../types';

// Map day abbreviations to full day names
const daysMap: Record<string, string> = {
  'Seg': 'Segunda',
  'Ter': 'Terça',
  'Qua': 'Quarta',
  'Qui': 'Quinta',
  'Sex': 'Sexta',
  'Sab': 'Sábado',
  'Dom': 'Domingo'
};

// Generate study blocks based on selected days and daily hours
export const generateStudyBlocks = (selectedDays: string[], dailyHours: number): StudyBlock[] => {
  const blocks: StudyBlock[] = [];
  
  selectedDays.forEach(day => {
    const dayName = daysMap[day];
    let hoursRemaining = dailyHours;
    let startHour = 8; // Start at 8:00 AM by default
    
    while (hoursRemaining > 0) {
      const blockDuration = Math.min(hoursRemaining, 2); // Max block duration is 2 hours
      blocks.push({
        id: `${day}-${startHour}`,
        day: dayName,
        startTime: `${startHour}:00`,
        endTime: `${startHour + blockDuration}:00`,
        duration: blockDuration
      });
      
      startHour += blockDuration;
      hoursRemaining -= blockDuration;
    }
  });
  
  return blocks;
};