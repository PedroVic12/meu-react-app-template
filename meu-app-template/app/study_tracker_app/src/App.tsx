import React from 'react';
import GoalsPage from './components/GoalsPage';
import TasksPage from './components/TasksPage';
import { useStateStore } from './controllers/StateController';

function App() {
  const {
    currentPage,
    goals,
    studyBlocks,
    tasks,
    setWeeklyGoal,
    setDailyHours,
    toggleDay,
    finishGoalSettings,
    addTask,
    toggleTaskCompletion,
    removeTask,
    setCurrentPage
  } = useStateStore();

  return (
    <div className="min-h-screen bg-black text-white">
      {currentPage === 'goals' ? (
        <GoalsPage 
          goals={goals}
          setWeeklyGoal={setWeeklyGoal}
          setDailyHours={setDailyHours}
          toggleDay={toggleDay}
          finishGoalSettings={finishGoalSettings}
        />
      ) : (
        <TasksPage 
          studyBlocks={studyBlocks}
          tasks={tasks}
          addTask={addTask}
          toggleTaskCompletion={toggleTaskCompletion}
          removeTask={removeTask}
          goToGoalsPage={() => setCurrentPage('goals')}
        />
      )}
    </div>
  );
}

export default App;