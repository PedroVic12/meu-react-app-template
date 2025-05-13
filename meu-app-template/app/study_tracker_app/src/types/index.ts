export interface StudyGoals {
  weeklyGoal: number;
  dailyHours: number;
  selectedDays: string[];
}

export interface StudyBlock {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  duration: number;
}

export type TaskCategory = 'faculdade' | 'projetos' | 'pvrv';

export interface Task {
  id: number;
  text: string;
  completed: boolean;
  category: TaskCategory;
}

export interface Tasks {
  [blockId: string]: Task[];
}