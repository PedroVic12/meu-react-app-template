import { StudyGoals, StudyBlock, Tasks } from '../types';

// Storage keys
const GOALS_KEY = 'studyGoals';
const BLOCKS_KEY = 'studyBlocks';
const TASKS_KEY = 'studyTasks';

// Load data from localStorage
export const loadGoals = (): StudyGoals | null => {
  const savedGoals = localStorage.getItem(GOALS_KEY);
  return savedGoals ? JSON.parse(savedGoals) : null;
};

export const loadBlocks = (): StudyBlock[] => {
  const savedBlocks = localStorage.getItem(BLOCKS_KEY);
  return savedBlocks ? JSON.parse(savedBlocks) : [];
};

export const loadTasks = (): Tasks => {
  const savedTasks = localStorage.getItem(TASKS_KEY);
  return savedTasks ? JSON.parse(savedTasks) : {};
};

// Save data to localStorage
export const saveGoals = (goals: StudyGoals): void => {
  localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
};

export const saveBlocks = (blocks: StudyBlock[]): void => {
  localStorage.setItem(BLOCKS_KEY, JSON.stringify(blocks));
};

export const saveTasks = (tasks: Tasks): void => {
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
};