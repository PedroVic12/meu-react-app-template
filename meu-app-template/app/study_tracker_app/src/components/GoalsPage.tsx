import React from 'react';
import { StudyGoals } from '../types';
import { Clock } from 'lucide-react';

interface GoalsPageProps {
  goals: StudyGoals;
  setWeeklyGoal: (goal: number) => void;
  setDailyHours: (hours: number) => void;
  toggleDay: (day: string) => void;
  finishGoalSettings: () => void;
}

const GoalsPage: React.FC<GoalsPageProps> = ({
  goals,
  setWeeklyGoal,
  setDailyHours,
  toggleDay,
  finishGoalSettings
}) => {
  const { weeklyGoal, dailyHours, selectedDays } = goals;
  const currentStep = 6;
  const totalSteps = 7;

  // Check if a day is selected
  const isDaySelected = (day: string): boolean => selectedDays.includes(day);
  
  // All weekdays
  const weekdays = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'];

  return (
    <div className="max-w-md mx-auto p-4 pt-8">
      <h1 className="text-3xl font-bold mb-2">Defina sua meta de estudos</h1>
      <p className="mb-4">
        Defina ao menos <span className="text-pink-500 font-bold">{weeklyGoal}</span> horas de estudo semanais para concluir até dia
      </p>
      
      <div className="bg-green-500 rounded-lg p-4 mb-8 flex items-center">
        <Clock className="w-6 h-6 mr-2" />
        <span className="font-bold">Sua meta definida é de {weeklyGoal}h de estudo semanais.</span>
      </div>
      
      <div className="mb-8">
        <h2 className="text-lg mb-2">Quanto tempo você quer dedicar a aprender por dia?</h2>
        <label className="block mb-2">Horas</label>
        <div className="relative inline-block">
          <select 
            className="appearance-none bg-gray-900 border border-gray-600 rounded-lg p-2 pr-8 text-white"
            value={dailyHours}
            onChange={(e) => setDailyHours(Number(e.target.value))}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map(hour => (
              <option key={hour} value={hour}>{hour}</option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-lg mb-4">Escolha os dias nos quais deseja estudar</h2>
        <div className="flex justify-between">
          {weekdays.map((day, index) => (
            <button
              key={index}
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors duration-200 ${
                isDaySelected(day) ? 'bg-pink-500 hover:bg-pink-600' : 'bg-gray-800 hover:bg-gray-700'
              }`}
              onClick={() => toggleDay(day)}
            >
              {day}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-8">
        <div className="text-gray-400">{currentStep}/{totalSteps}</div>
        <button
          className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-200"
          onClick={finishGoalSettings}
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

export default GoalsPage;