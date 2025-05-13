import React, { useState } from 'react';
import { Task, TaskCategory } from '../types';
import { Check, Plus, X } from 'lucide-react';
import StudyBlockChart from './StudyBlockChart';

interface StudyBlockProps {
  blockId: string;
  startTime: string;
  endTime: string;
  duration: number;
  tasks: Task[];
  addTask: (blockId: string, taskText: string, category: TaskCategory) => void;
  toggleTaskCompletion: (blockId: string, taskId: number) => void;
  removeTask: (blockId: string, taskId: number) => void;
}

const StudyBlock: React.FC<StudyBlockProps> = ({
  blockId,
  startTime,
  endTime,
  duration,
  tasks,
  addTask,
  toggleTaskCompletion,
  removeTask
}) => {
  const [newTaskText, setNewTaskText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory>('faculdade');
  
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskText.trim()) {
      addTask(blockId, newTaskText, selectedCategory);
      setNewTaskText('');
    }
  };
  
  return (
    <div className="bg-gray-900 rounded-lg p-4 transition-all duration-200 hover:shadow-lg">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold">{startTime} - {endTime}</h3>
        <span className="text-sm text-gray-400">{duration}h</span>
      </div>
      
      <StudyBlockChart tasks={tasks} duration={duration} />
      
      <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
        {tasks.length === 0 ? (
          <p className="text-gray-500 text-sm">Nenhuma tarefa adicionada</p>
        ) : (
          tasks.map(task => (
            <div key={task.id} className="flex items-center group">
              <button
                className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors duration-200 ${
                  task.completed ? 'bg-pink-500 border-pink-500' : 'border-gray-500 hover:border-pink-400'
                } mr-2 flex-shrink-0`}
                onClick={() => toggleTaskCompletion(blockId, task.id)}
                aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
              >
                {task.completed && <Check className="w-3 h-3 text-white" />}
              </button>
              <span className={`flex-grow ${task.completed ? 'line-through text-gray-500' : ''}`}>
                {task.text}
              </span>
              <span className={`px-2 py-1 rounded text-xs mr-2 ${
                task.category === 'faculdade' ? 'bg-blue-500' :
                task.category === 'projetos' ? 'bg-green-500' :
                'bg-purple-500'
              }`}>
                {task.category}
              </span>
              <button
                className="text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                onClick={() => removeTask(blockId, task.id)}
                aria-label="Remove task"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
      
      <form onSubmit={handleAddTask} className="flex flex-col gap-2">
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-grow bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-pink-500"
            placeholder="Adicionar tarefa..."
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
          />
          <select
            className="bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-pink-500"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as TaskCategory)}
          >
            <option value="faculdade">Faculdade</option>
            <option value="projetos">Projetos</option>
            <option value="pvrv">PVRV</option>
          </select>
          <button
            type="submit"
            className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center"
            disabled={!newTaskText.trim()}
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudyBlock;