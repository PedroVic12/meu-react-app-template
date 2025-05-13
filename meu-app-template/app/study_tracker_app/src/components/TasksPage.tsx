import React from 'react';
import { StudyBlock as StudyBlockType, Tasks } from '../types';
import StudyBlock from './StudyBlock';
import { ChevronLeft } from 'lucide-react';

interface TasksPageProps {
  studyBlocks: StudyBlockType[];
  tasks: Tasks;
  addTask: (blockId: string, taskText: string) => void;
  toggleTaskCompletion: (blockId: string, taskId: number) => void;
  removeTask: (blockId: string, taskId: number) => void;
  goToGoalsPage: () => void;
}

const TasksPage: React.FC<TasksPageProps> = ({
  studyBlocks,
  tasks,
  addTask,
  toggleTaskCompletion,
  removeTask,
  goToGoalsPage
}) => {
  // Group blocks by day
  const blocksByDay = studyBlocks.reduce<Record<string, StudyBlockType[]>>((acc, block) => {
    if (!acc[block.day]) {
      acc[block.day] = [];
    }
    acc[block.day].push(block);
    return acc;
  }, {});

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Seus Blocos de Estudo</h1>
        <button 
          className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-lg text-sm flex items-center transition-colors duration-200"
          onClick={goToGoalsPage}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Editar Metas
        </button>
      </div>
      
      {Object.keys(blocksByDay).length === 0 ? (
        <div className="text-center py-8 bg-gray-900 rounded-lg p-8">
          <p className="text-gray-400 mb-4">Nenhum bloco de estudo definido ainda.</p>
          <button 
            className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200"
            onClick={goToGoalsPage}
          >
            Definir Metas de Estudo
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(blocksByDay).map(([day, blocks]) => (
            <div key={day} className="border-b border-gray-700 pb-6">
              <h2 className="text-xl font-bold mb-4">{day}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {blocks.map(block => (
                  <StudyBlock 
                    key={block.id} 
                    blockId={block.id}
                    startTime={block.startTime}
                    endTime={block.endTime}
                    duration={block.duration}
                    tasks={tasks[block.id] || []} 
                    addTask={addTask}
                    toggleTaskCompletion={toggleTaskCompletion}
                    removeTask={removeTask}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TasksPage;