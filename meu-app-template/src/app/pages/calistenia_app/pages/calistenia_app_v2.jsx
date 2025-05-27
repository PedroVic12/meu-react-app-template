import React, { useState, useEffect } from 'react';

// Exercise Model
class Exercise {
  constructor(treino, name, sets, reps, difficulty, youtubeUrl) {
    this.treino = treino;
    this.name = name;
    this.sets = sets;
    this.reps = reps;
    this.difficulty = difficulty;
    this.youtubeUrl = youtubeUrl;
  }
}

let array_treinos = [
  Exercise(
    '100 Push ups - Chris Heria',
    'flexao normal',
    5,
    '10-15',
    'Normal',
    'https://www.youtube.com/watch?v=IYLxm0T6qls'
  
  ),
  Exercise(
    '100 Push ups - Chris Heria',
    'Flexão Lateral',
    5,
    '10-15',
    'Normal',
    'https://www.youtube.com/watch?v=IYLxm0T6qls'
    
  )
]


// Data Repository Class
class DataRepository {
  constructor() {
    console.log("Initializing DataRepository");
    this.initialData = {
      workouts: {
        push: [
          { id: 'push-1', name: '100 Push ups - Chris Heria', sets: 5, reps: '10-15', youtubeUrl: 'https://www.youtube.com/watch?v=IYLxm0T6qls', difficulty: 'Normal' },
          { id: 'push-2', name: '5 minutes 30x30', sets: 2, reps: '30', youtubeUrl: '', difficulty: 'Normal' },
          { id: 'push-3', name: 'Moves of the day - treino de peito', sets: 4, reps: '12', youtubeUrl: 'https://www.youtube.com/watch?v=ypxmdLxCK7k', difficulty: 'Normal' }
        ],
        pull: [
          { id: 'pull-1', name: '100 Pull ups - Chris Heria', sets: 3, reps: '10', youtubeUrl: '', difficulty: 'Normal' },
          { id: 'pull-2', name: 'Skin the Cat + Muscle Up', sets: 2, reps: '5-8', youtubeUrl: '', difficulty: 'Sayajin' },
          { id: 'pull-3', name: '5 minutes 30x30', sets: 2, reps: '30', youtubeUrl: '', difficulty: 'Normal' }
        ],
        legs: [
          { id: 'legs-1', name: '100 Squads a Day', sets: 5, reps: '20', youtubeUrl: 'https://www.youtube.com/watch?v=qLPrPVz4NzQ', difficulty: 'Normal' }
        ],
        abs: [
          { id: 'abs-1', name: 'Get ABS in 28 Days', sets: 5, reps: '15', youtubeUrl: 'https://www.youtube.com/watch?v=TIMghHu6QFU', difficulty: 'Normal' },
          { id: 'abs-2', name: 'DO THIS ABS WORKOUT EVERY DAY', sets: 7, reps: '12', youtubeUrl: 'https://www.youtube.com/watch?v=xRXhpMsLaXo', difficulty: 'Normal' }
        ]
      },
      TUTORIAL_YOUTUBE: {
        mobilidade: [
          "https://www.youtube.com/watch?v=XmaD8jne22Y",
          "https://www.youtube.com/watch?v=mXnuAyBVWYM"
        ],
        motivacao: [
          "https://www.youtube.com/watch?v=bKcIhVpIzDY",
          "https://www.youtube.com/watch?v=8GKZ5o5z5dE",
          "https://www.youtube.com/watch?v=RQLK1UqOg5Y"
        ],
        coding: [""]
      },
      workoutLogs: {
        "2025-03-18": {
          name: "Pull treino leve",
          exercises: [
            { description: "3x 10 - Pull up", completed: true },
            { description: "3x 10 - Chin Up", completed: true },
            { description: "5x 15 - Dips na paralela", completed: true }
          ]
        },
        "2025-03-19": {
          name: "Push treino leve",
          exercises: [
            { description: "1x 20 - Flexão Diamante", completed: true },
            { description: "1x 25 - Flexão normal", completed: true },
            { description: "1x 8 - Flexão hold 3s", completed: true },
            { description: "1x 12 - Flexão normal", completed: true },
            { description: "1x 10 - Flexão inclinada", completed: true }
          ]
        }
      }
    };
  }

  getInitialWorkouts() {
    console.log("Getting initial workouts");
    return { ...this.initialData.workouts };
  }

  getWorkoutLogs() {
    const savedLogs = localStorage.getItem('calisthenicsWorkoutLogs');
    if (savedLogs) {
      return JSON.parse(savedLogs);
    } else {
      const initialLogs = this.initialData.workoutLogs;
      localStorage.setItem('calisthenicsWorkoutLogs', JSON.stringify(initialLogs));
      return initialLogs;
    }
  }

  saveWorkoutLogs(logs) {
    localStorage.setItem('calisthenicsWorkoutLogs', JSON.stringify(logs));
  }

  loadWorkouts() {
    const savedWorkouts = localStorage.getItem('calisthenicsWorkouts');
    if (savedWorkouts) {
      console.log("Loaded workouts from localStorage:", JSON.parse(savedWorkouts));
      return JSON.parse(savedWorkouts);
    } else {
      const initialWorkouts = this.getInitialWorkouts();
      this.saveWorkouts(initialWorkouts);
      console.log("No workouts found in localStorage. Using initial data:", initialWorkouts);
      return initialWorkouts;
    }
  }

  saveWorkouts(workouts) {
    localStorage.setItem('calisthenicsWorkouts', JSON.stringify(workouts));
    console.log("Saved workouts to localStorage:", workouts);
  }
}

// Controller class
class AppController {
  constructor(repository) {
    this.repository = repository;
    this.workouts = this.repository.loadWorkouts();
    this.workoutLogs = this.repository.getWorkoutLogs();
  }

  getWorkouts() {
    return this.workouts;
  }

  getWorkoutLogs() {
    return this.workoutLogs;
  }

  addExercise(category, newExercise) {
    if (!this.workouts[category]) {
      this.workouts[category] = []; // Initialize category if it doesn't exist
    }
    this.workouts[category].push(newExercise);
    this.repository.saveWorkouts(this.workouts);
    return this.workouts;
  }

  deleteExercise(category, exerciseId) {
    if (this.workouts[category]) {
      this.workouts[category] = this.workouts[category].filter(ex => ex.id !== exerciseId);
      this.repository.saveWorkouts(this.workouts);
    }
    return this.workouts;
  }

  saveWorkoutLog(date, workoutLog) {
    this.workoutLogs[date] = workoutLog;
    this.repository.saveWorkoutLogs(this.workoutLogs);
    return this.workoutLogs;
  }
}

// YouTube Video Component
const YouTubeVideo = ({ title, youtubeUrl }) => {
  const videoId = youtubeUrl.split('v=')[1]?.split('&')[0];
  if (!videoId) {
    return <div style={{ color: 'red' }}>URL do YouTube inválido.</div>;
  }
  const embedUrl = `https://www.youtube.com/embed/${videoId}`;
  return (
    <div style={{ margin: '10px 0', padding: '10px', border: '1px solid #333', borderRadius: '5px', backgroundColor: '#1e1e1e' }}>
      <h3 style={{ margin: '0 0 10px 0' }}>{title}</h3>
      <iframe width="100%" height="200" src={embedUrl} title={title} frameBorder="0" allowFullScreen style={{ borderRadius: '4px' }} />
    </div>
  );
};

// Exercise Component
const ExerciseCard = ({ exercise, onDelete, checkedExercises, onToggleCheck }) => {
  const isAllChecked = checkedExercises[exercise.id] && 
    checkedExercises[exercise.id].length === exercise.sets && 
    checkedExercises[exercise.id].every(Boolean);

  return (
    <div style={{ marginBottom: '15px', padding: '15px', border: '1px solid #333', borderRadius: '5px', backgroundColor: '#1e1e1e' }}>
      <h3 style={{ margin: '0 0 10px 0' }}>{exercise.name}</h3>
      <div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#252525', padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>
        <div><strong>Sets:</strong> {exercise.sets}</div>
        <div><strong>Reps:</strong> {exercise.reps}</div>
      </div>
      <div style={{ marginBottom: '15px' }}>
        <h4 style={{ marginTop: 0, marginBottom: '10px' }}>Progress Tracking:</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {Array.from({ length: exercise.sets }).map((_, setIndex) => (
            <label key={setIndex} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <input
                type="checkbox"
                checked={checkedExercises[exercise.id]?.[setIndex] || false}
                onChange={(e) => onToggleCheck(exercise.id, setIndex, e.target.checked)}
              />
              Set {setIndex + 1}
            </label>
          ))}
        </div>
      </div>
      {isAllChecked && (
        <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#4caf50', color: 'white', borderRadius: '4px', textAlign: 'center' }}>
          Treino concluído! 🎉
        </div>
      )}
      <button onClick={() => onDelete(exercise.id)} style={{ padding: '8px 12px', backgroundColor: '#dc004e', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
        🗑️ Delete Exercise
      </button>
      {exercise.youtubeUrl && <YouTubeVideo title={exercise.name} youtubeUrl={exercise.youtubeUrl} />}
    </div>
  );
};

// Workout Log Component
const WorkoutLogItem = ({ date, log }) => {
  return (
    <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #333', borderRadius: '5px', backgroundColor: '#1e1e1e' }}>
      <h3 style={{ marginTop: 0, marginBottom: '15px' }}>
        {date} - {log.name}
      </h3>
      {log.exercises.map((exercise, index) => (
        <div key={index} style={{ 
          display: 'flex', 
          alignItems: 'center', 
          padding: '8px', 
          backgroundColor: exercise.completed ? 'rgba(76, 175, 80, 0.2)' : 'transparent',
          marginBottom: '8px',
          borderRadius: '4px'
        }}>
          <input 
            type="checkbox" 
            checked={exercise.completed} 
            readOnly 
            style={{ marginRight: '10px' }} 
          />
          <span>{exercise.description}</span>
        </div>
      ))}
    </div>
  );
};

// Main App Component
const CalisthenicsApp = () => {
  const repository = new DataRepository();
  const controller = new AppController(repository);

  const [selectedTab, setSelectedTab] = useState('push');
  const [workouts, setWorkouts] = useState(controller.getWorkouts());
  const [workoutLogs, setWorkoutLogs] = useState(controller.getWorkoutLogs());
  const [newExerciseName, setNewExerciseName] = useState('');
  const [newExerciseSets, setNewExerciseSets] = useState(1);
  const [newExerciseReps, setNewExerciseReps] = useState('');
  const [checkedExercises, setCheckedExercises] = useState({});
  
  // New workout log form state
  const [newLogDate, setNewLogDate] = useState(new Date().toISOString().split('T')[0]);
  const [newLogName, setNewLogName] = useState('');
  const [newLogExercises, setNewLogExercises] = useState([{ description: '', completed: false }]);

  const handleAddExercise = (category) => {
    if (!newExerciseName.trim()) {
      alert('Por favor, insira um nome para o exercício');
      return;
    }
    const newExercise = {
      id: `${category}-${Date.now()}`,
      name: newExerciseName,
      sets: Number(newExerciseSets) || 1,
      reps: newExerciseReps || 'N/A',
    };
    const updatedWorkouts = controller.addExercise(category, newExercise);
    setWorkouts({ ...updatedWorkouts });
    setNewExerciseName('');
    setNewExerciseSets(1);
    setNewExerciseReps('');
  };

  const handleDeleteExercise = (exerciseId) => {
    const updatedWorkouts = controller.deleteExercise(selectedTab, exerciseId);
    setWorkouts({ ...updatedWorkouts });
  };

  const handleToggleCheck = (exerciseId, setIndex, checked) => {
    setCheckedExercises((prev) => {
      const updated = { ...prev };
      if (!updated[exerciseId]) {
        updated[exerciseId] = Array(workouts[selectedTab].find(ex => ex.id === exerciseId).sets).fill(false);
      }
      updated[exerciseId][setIndex] = checked;
      return updated;
    });
  };

  const handleAddLogExercise = () => {
    setNewLogExercises([...newLogExercises, { description: '', completed: false }]);
  };

  const handleRemoveLogExercise = (index) => {
    setNewLogExercises(newLogExercises.filter((_, i) => i !== index));
  };

  const handleChangeLogExercise = (index, field, value) => {
    const updatedExercises = [...newLogExercises];
    updatedExercises[index][field] = value;
    setNewLogExercises(updatedExercises);
  };

  const handleSaveWorkoutLog = () => {
    if (!newLogName.trim()) {
      alert('Por favor, insira um nome para o treino');
      return;
    }
    
    if (newLogExercises.some(ex => !ex.description.trim())) {
      alert('Por favor, preencha todos os exercícios');
      return;
    }

    const newLog = {
      name: newLogName,
      exercises: newLogExercises
    };
    
    const updatedLogs = controller.saveWorkoutLog(newLogDate, newLog);
    setWorkoutLogs({ ...updatedLogs });
    
    // Reset form
    setNewLogName('');
    setNewLogExercises([{ description: '', completed: false }]);
    alert('Treino registrado com sucesso!');
  };

  const renderTabButtons = () => {
    const tabs = ['push', 'pull', 'legs', 'abs', 'tutorials', 'logs', 'dashboard']; // Added logs tab
    return (
      <div style={{ display: 'flex', overflowX: 'auto', backgroundColor: '#1e1e1e', borderRadius: '5px', marginBottom: '20px' }}>
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            style={{
              padding: '10px 20px',
              color: selectedTab === tab ? '#1976d2' : '#fff',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: selectedTab === tab ? '2px solid #1976d2' : 'none',
              cursor: 'pointer',
              fontWeight: selectedTab === tab ? 'bold' : 'normal',
              flex: '1 0 auto',
              textTransform: 'capitalize',
              whiteSpace: 'nowrap'
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
    );
  };

  const renderWorkoutTab = (category) => {
    const categoryWorkouts = workouts[category] || [];
    return (
      <div style={{ padding: '20px' }}>
        <h2 style={{ marginTop: 0, textTransform: 'capitalize' }}> Treino: {category.charAt(0).toUpperCase() + category.slice(1)}</h2>
        <div style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '10px' }}> {/* Added vertical scroll */}
          {categoryWorkouts.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              onDelete={handleDeleteExercise}
              checkedExercises={checkedExercises}
              onToggleCheck={handleToggleCheck}
            />
          ))}
        </div>
        <div style={{ marginTop: '20px' }}>
          <h3>Adicionar Exercício</h3>
          <input
            type="text"
            placeholder="Nome do exercício"
            value={newExerciseName}
            onChange={(e) => setNewExerciseName(e.target.value)}
            style={{ padding: '8px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#333', color: 'white', marginRight: '10px', marginBottom: '10px' }}
          />
          <input
            type="number"
            placeholder="Sets"
            value={newExerciseSets}
            onChange={(e) => setNewExerciseSets(e.target.value)}
            style={{ padding: '8px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#333', color: 'white', marginRight: '10px', marginBottom: '10px' }}
          />
          <input
            type="text"
            placeholder="Reps"
            value={newExerciseReps}
            onChange={(e) => setNewExerciseReps(e.target.value)}
            style={{ padding: '8px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#333', color: 'white', marginRight: '10px', marginBottom: '10px' }}
          />
          <button onClick={() => handleAddExercise(category)} style={{ padding: '8px 16px', backgroundColor: '#4caf50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Adicionar
          </button>
        </div>
      </div>
    );
  };

  const renderTutorials = () => {
    const tutorials = Object.entries(repository.initialData.TUTORIAL_YOUTUBE).flatMap(([category, urls]) =>
      urls.filter(url => url).map((url, index) => (
        <YouTubeVideo key={`${category}-${index}`} title={`Tutorial ${index + 1} - ${category}`} youtubeUrl={url} />
      ))
    );

    return (
      <div style={{ padding: '20px' }}>
        <h2>Tutoriais</h2>
        <div style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '10px' }}>
          {tutorials.length > 0 ? tutorials : <div>Nenhum tutorial disponível.</div>}
        </div>
      </div>
    );
  };

  const renderLogs = () => {
    return (
      <div style={{ padding: '20px' }}>
        <h2>Registro de Treinos</h2>
        
        <div style={{ maxHeight: '40vh', overflowY: 'auto', paddingRight: '10px', marginBottom: '30px' }}>
          {Object.entries(workoutLogs).length > 0 ? (
            Object.entries(workoutLogs)
              .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA))
              .map(([date, log]) => (
                <WorkoutLogItem key={date} date={date} log={log} />
              ))
          ) : (
            <div>Nenhum treino registrado ainda.</div>
          )}
        </div>
        
        <h3>Registrar Novo Treino</h3>
        <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #333', borderRadius: '5px', backgroundColor: '#1e1e1e' }}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Data:</label>
            <input
              type="date"
              value={newLogDate}
              onChange={(e) => setNewLogDate(e.target.value)}
              style={{ padding: '8px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#333', color: 'white', width: '100%' }}
            />
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Nome do Treino:</label>
            <input
              type="text"
              placeholder="Ex: Push treino leve"
              value={newLogName}
              onChange={(e) => setNewLogName(e.target.value)}
              style={{ padding: '8px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#333', color: 'white', width: '100%' }}
            />
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Exercícios:</label>
            {newLogExercises.map((exercise, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', gap: '10px' }}>
                <input
                  type="checkbox"
                  checked={exercise.completed}
                  onChange={(e) => handleChangeLogExercise(index, 'completed', e.target.checked)}
                />
                <input
                  type="text"
                  placeholder="Ex: 3x 10 - Pull up"
                  value={exercise.description}
                  onChange={(e) => handleChangeLogExercise(index, 'description', e.target.value)}
                  style={{ padding: '8px', borderRadius: '5px', border: '1px solid #555', backgroundColor: '#333', color: 'white', flex: 1 }}
                />
                <button 
                  onClick={() => handleRemoveLogExercise(index)}
                  style={{ padding: '5px 10px', backgroundColor: '#dc004e', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                  🗑️
                </button>
              </div>
            ))}
            <button 
              onClick={handleAddLogExercise}
              style={{ padding: '5px 10px', backgroundColor: '#1976d2', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '5px' }}
            >
              + Adicionar Exercício
            </button>
          </div>
          
          <button 
            onClick={handleSaveWorkoutLog}
            style={{ padding: '8px 16px', backgroundColor: '#4caf50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', width: '100%' }}
          >
            Salvar Treino
          </button>
        </div>
      </div>
    );
  };

  const renderDashboard = () => {
    const totalExercises = Object.entries(workouts).flatMap(([category, exercises]) => exercises).length;
    const completedExercises = Object.entries(checkedExercises).reduce((total, [exerciseId, sets]) => {
      return total + sets.filter(Boolean).length; // Count checked sets
    }, 0);
    
    const totalWorkouts = Object.keys(workoutLogs).length;
    const totalWorkoutExercises = Object.values(workoutLogs).reduce((total, log) => {
      return total + log.exercises.length;
    }, 0);
    const completedWorkoutExercises = Object.values(workoutLogs).reduce((total, log) => {
      return total + log.exercises.filter(ex => ex.completed).length;
    }, 0);

    return (
      <div style={{ padding: '20px' }}>
        <h2>Dashboard</h2>
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '30px' }}>
          <div style={{ flex: '1 0 200px', padding: '15px', backgroundColor: '#1e1e1e', borderRadius: '5px', border: '1px solid #333' }}>
            <h3 style={{ margin: '0 0 10px 0' }}>Exercícios</h3>
            <p>Total: {totalExercises}</p>
            <p>Sets Completos: {completedExercises}</p>
            <p>Progress: {totalExercises > 0 ? Math.round((completedExercises / (totalExercises * 4)) * 100) : 0}%</p>
          </div>
          
          <div style={{ flex: '1 0 200px', padding: '15px', backgroundColor: '#1e1e1e', borderRadius: '5px', border: '1px solid #333' }}>
            <h3 style={{ margin: '0 0 10px 0' }}>Treinos</h3>
            <p>Total: {totalWorkouts}</p>
            <p>Exercícios Completos: {completedWorkoutExercises}/{totalWorkoutExercises}</p>
            <p>Progress: {totalWorkoutExercises > 0 ? Math.round((completedWorkoutExercises / totalWorkoutExercises) * 100) : 0}%</p>
          </div>
        </div>
        
        <h3>Todos os Exercícios</h3>
        <div style={{ maxHeight: '40vh', overflowY: 'auto', paddingRight: '10px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #333', padding: '8px', backgroundColor: '#1e1e1e', position: 'sticky', top: 0 }}>Categoria</th>
                <th style={{ border: '1px solid #333', padding: '8px', backgroundColor: '#1e1e1e', position: 'sticky', top: 0 }}>Exercício</th>
                <th style={{ border: '1px solid #333', padding: '8px', backgroundColor: '#1e1e1e', position: 'sticky', top: 0 }}>Sets</th>
                <th style={{ border: '1px solid #333', padding: '8px', backgroundColor: '#1e1e1e', position: 'sticky', top: 0 }}>Reps</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(workouts).flatMap(([category, exercises]) =>
                exercises.map((exercise) => (
                  <tr key={exercise.id}>
                    <td style={{ border: '1px solid #333', padding: '8px' }}>{category.charAt(0).toUpperCase() + category.slice(1)}</td>
                    <td style={{ border: '1px solid #333', padding: '8px' }}>{exercise.name}</td>
                    <td style={{ border: '1px solid #333', padding: '8px', textAlign: 'center' }}>{exercise.sets}</td>
                    <td style={{ border: '1px solid #333', padding: '8px', textAlign: 'center' }}>{exercise.reps}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div style={{ backgroundColor: '#121212', minHeight: '100vh', color: 'white', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '30px', paddingTop: '20px' }}>Calistenia Workout App</h1>
        {renderTabButtons()}
        <div style={{ backgroundColor: '#1e1e1e', borderRadius: '5px', overflow: 'hidden' }}>
          {selectedTab === 'push' && renderWorkoutTab('push')}
          {selectedTab === 'pull' && renderWorkoutTab('pull')}
          {selectedTab === 'legs' && renderWorkoutTab('legs')}
          {selectedTab === 'abs' && renderWorkoutTab('abs')}
          {selectedTab === 'tutorials' && renderTutorials()}
          {selectedTab === 'logs' && renderLogs()}
          {selectedTab === 'dashboard' && renderDashboard()}
        </div>
      </div>
    </div>
  );
};

export default CalisthenicsApp;