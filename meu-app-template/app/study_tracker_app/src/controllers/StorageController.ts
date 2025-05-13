import { StudyGoals, StudyBlock, Tasks } from '../types';
import { createHash } from '../utils/hash';

export class StorageController {
  private static readonly GOALS_KEY = 'studyGoals';
  private static readonly BLOCKS_KEY = 'studyBlocks';
  private static readonly TASKS_KEY = 'studyTasks';

  static loadGoals(): StudyGoals | null {
    const hash = localStorage.getItem(`${this.GOALS_KEY}_hash`);
    const data = localStorage.getItem(this.GOALS_KEY);
    
    if (!data || !hash) return null;
    
    if (createHash(data) !== hash) {
      console.warn('Data integrity check failed for goals');
      return null;
    }
    
    return JSON.parse(data);
  }

  static loadBlocks(): StudyBlock[] {
    const hash = localStorage.getItem(`${this.BLOCKS_KEY}_hash`);
    const data = localStorage.getItem(this.BLOCKS_KEY);
    
    if (!data || !hash) return [];
    
    if (createHash(data) !== hash) {
      console.warn('Data integrity check failed for blocks');
      return [];
    }
    
    return JSON.parse(data);
  }

  static loadTasks(): Tasks {
    const hash = localStorage.getItem(`${this.TASKS_KEY}_hash`);
    const data = localStorage.getItem(this.TASKS_KEY);
    
    if (!data || !hash) return {};
    
    if (createHash(data) !== hash) {
      console.warn('Data integrity check failed for tasks');
      return {};
    }
    
    return JSON.parse(data);
  }

  static saveGoals(goals: StudyGoals): void {
    const data = JSON.stringify(goals);
    const hash = createHash(data);
    localStorage.setItem(this.GOALS_KEY, data);
    localStorage.setItem(`${this.GOALS_KEY}_hash`, hash);
  }

  static saveBlocks(blocks: StudyBlock[]): void {
    const data = JSON.stringify(blocks);
    const hash = createHash(data);
    localStorage.setItem(this.BLOCKS_KEY, data);
    localStorage.setItem(`${this.BLOCKS_KEY}_hash`, hash);
  }

  static saveTasks(tasks: Tasks): void {
    const data = JSON.stringify(tasks);
    const hash = createHash(data);
    localStorage.setItem(this.TASKS_KEY, data);
    localStorage.setItem(`${this.TASKS_KEY}_hash`, hash);
  }
}