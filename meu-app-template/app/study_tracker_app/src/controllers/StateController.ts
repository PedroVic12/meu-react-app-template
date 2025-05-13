import { create } from 'zustand';
import { StudyGoals, StudyBlock, Tasks, TaskCategory } from '../types';
import { StorageController } from './StorageController';
import { generateStudyBlocks } from '../utils/blockGenerator';

interface State {
  currentPage: 'goals' | 'tasks';
  goals: StudyGoals;
  studyBlocks: StudyBlock[];
  tasks: Tasks;
  setCurrentPage: (page: 'goals' | 'tasks') => void;
  setWeeklyGoal: (goal: number) => void;
  setDailyHours: (hours: number) => void;
  toggleDay: (day: string) => void;
  finishGoalSettings: () => void;
  addTask: (blockId: string, taskText: string, category: TaskCategory) => void;
  toggleTaskCompletion: (blockId: string, taskId: number) => void;
  removeTask: (blockId: string, taskId: number) => void;
}

const DEFAULT_GOALS: StudyGoals = {
  weeklyGoal: 8,
  dailyHours: 2,
  selectedDays: ['S', 'T', 'S', 'S']
};

export const useStateStore = create<State>((set, get) => ({
  currentPage: 'goals',
  goals: StorageController.loadGoals() || DEFAULT_GOALS,
  studyBlocks: StorageController.loadBlocks(),
  tasks: StorageController.loadTasks(),

  setCurrentPage: (page) => set({ currentPage: page }),

  setWeeklyGoal: (goal) => {
    const newGoals = { ...get().goals, weeklyGoal: goal };
    set({ goals: newGoals });
    StorageController.saveGoals(newGoals);
  },

  setDailyHours: (hours) => {
    const newGoals = { ...get().goals, dailyHours: hours };
    set({ goals: newGoals });
    StorageController.saveGoals(newGoals);
  },

  toggleDay: (day) => {
    const { goals } = get();
    const newSelectedDays = goals.selectedDays.includes(day)
      ? goals.selectedDays.filter(d => d !== day)
      : [...goals.selectedDays, day];
    const newGoals = { ...goals, selectedDays: newSelectedDays };
    set({ goals: newGoals });
    StorageController.saveGoals(newGoals);
  },

  finishGoalSettings: () => {
    const { goals, tasks } = get();
    const newBlocks = generateStudyBlocks(goals.selectedDays, goals.dailyHours);
    
    const newTasks = { ...tasks };
    newBlocks.forEach(block => {
      if (!newTasks[block.id]) {
        newTasks[block.id] = [];
      }
    });

    set({ studyBlocks: newBlocks, tasks: newTasks, currentPage: 'tasks' });
    StorageController.saveBlocks(newBlocks);
    StorageController.saveTasks(newTasks);
  },

  addTask: (blockId, taskText, category) => {
    const { tasks } = get();
    const newTasks = {
      ...tasks,
      [blockId]: [
        ...(tasks[blockId] || []),
        { id: Date.now(), text: taskText, completed: false, category }
      ]
    };
    set({ tasks: newTasks });
    StorageController.saveTasks(newTasks);
  },

  toggleTaskCompletion: (blockId, taskId) => {
    const { tasks } = get();
    const newTasks = {
      ...tasks,
      [blockId]: tasks[blockId].map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    };
    set({ tasks: newTasks });
    StorageController.saveTasks(newTasks);
  },

  removeTask: (blockId, taskId) => {
    const { tasks } = get();
    const newTasks = {
      ...tasks,
      [blockId]: tasks[blockId].filter(task => task.id !== taskId)
    };
    set({ tasks: newTasks });
    StorageController.saveTasks(newTasks);
  }
}));