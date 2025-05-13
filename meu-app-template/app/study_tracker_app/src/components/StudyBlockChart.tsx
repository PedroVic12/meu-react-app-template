import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Task, TaskCategory } from '../types';

interface StudyBlockChartProps {
  tasks: Task[];
  duration: number;
}

const StudyBlockChart: React.FC<StudyBlockChartProps> = ({ tasks, duration }) => {
  const categories: TaskCategory[] = ['faculdade', 'projetos', 'pvrv'];
  
  const data = [{
    name: 'Tasks',
    ...categories.reduce((acc, category) => ({
      ...acc,
      [`${category}_completed`]: tasks.filter(t => t.category === category && t.completed).length,
      [`${category}_pending`]: tasks.filter(t => t.category === category && !t.completed).length,
    }), {}),
    empty: Math.max(0, duration - tasks.length)
  }];

  return (
    <div className="h-24 w-full mb-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical">
          <XAxis type="number" hide />
          <YAxis type="category" hide dataKey="name" />
          <Tooltip 
            formatter={(value, name) => {
              const [category, status] = name.split('_');
              return [value, `${category} (${status})`];
            }}
            contentStyle={{ backgroundColor: '#1F2937', border: 'none' }}
            itemStyle={{ color: '#fff' }}
          />
          <Legend />
          {/* Faculdade */}
          <Bar dataKey="faculdade_completed" stackId="1" fill="#3B82F6" />
          <Bar dataKey="faculdade_pending" stackId="1" fill="#1D4ED8" />
          {/* Projetos */}
          <Bar dataKey="projetos_completed" stackId="1" fill="#22C55E" />
          <Bar dataKey="projetos_pending" stackId="1" fill="#15803D" />
          {/* PVRV */}
          <Bar dataKey="pvrv_completed" stackId="1" fill="#A855F7" />
          <Bar dataKey="pvrv_pending" stackId="1" fill="#7E22CE" />
          {/* Empty space */}
          <Bar dataKey="empty" stackId="1" fill="#1F2937" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StudyBlockChart;