import React, { useState, useEffect } from 'react';

// Exercise Model
class Exercise {
  constructor(treino, name, sets, reps, difficulty, youtubeUrl) {
    this.id = Date.now().toString() + Math.random().toString(36).substr(2, 5);
    this.treino = treino;
    this.name = name;
    this.sets = sets;
    this.reps = reps;
    this.difficulty = difficulty;
    this.youtubeUrl = youtubeUrl;
  }
}

// Data Repository Class
class DataRepository {
  constructor() {
    this.initialData = {
      workouts: {
        push: [
          {
            treino: 'Push Treino 1',
            exercises: [
              new Exercise('Push Treino 1', 'Push ups', 5, '10-15', 'Normal', 'https://www.youtube.com/watch?v=IODxDxX7oi4'),
              new Exercise('Push Treino 1', 'Flexão Lateral', 5, '10-15', 'Normal', 'https://www.youtube.com/watch?v=IYLxm0T6qls'),
            ]
          },
          {
            treino: '100 Push ups - Chris Heria',
            exercises: [
              new Exercise('100 Push ups - Chris Heria', 'Flexão normal', 5, '10-15', 'Normal', 'https://www.youtube.com/watch?v=IYLxm0T6qls'),
              new Exercise('100 Push ups - Chris Heria', 'Flexão Lateral', 5, '10-15', 'Normal', 'https://www.youtube.com/watch?v=IYLxm0T6qls'),
            ]
          }
        ],
        pull: [
          {
            treino: 'Pull Treino 1',
            exercises: [
              new Exercise('Pull Treino 1', '100 Pull ups - Chris Heria', 3, '10', 'Normal', 'https://www.youtube.com/watch?v=poyr8KenUfc'),
              new Exercise('Pull Treino 1', 'Skin the Cat + Muscle Up', 2, '5-8', 'Sayajin', ''),
            ]
          }
        ],
        legs: [
          {
            treino: 'Legs Treino 1',
            exercises: [
              new Exercise('Legs Treino 1', '100 Squads a Day', 5, '20', 'Normal', 'https://www.youtube.com/watch?v=qLPrPVz4NzQ'),
            ]
          }
        ],
        abs: [
          {
            treino: 'Abs Treino 1',
            exercises: [
              new Exercise('Abs Treino 1', 'Get ABS in 28 Days', 5, '15', 'Normal', 'https://www.youtube.com/watch?v=TIMghHu6QFU'),
              new Exercise('Abs Treino 1', 'DO THIS ABS WORKOUT EVERY DAY', 7, '12', 'Normal', 'https://www.youtube.com/watch?v=xRXhpMsLaXo'),
            ]
          }
        ]
      }
    };
  }

  getInitialWorkouts() {
    return JSON.parse(JSON.stringify(this.initialData.workouts));
  }

  loadWorkouts() {
    // For the preview, we'll use memory instead of localStorage
    return this.getInitialWorkouts();
  }

  saveWorkouts(workouts) {
    // For the preview, we don't actually save to localStorage
    console.log("Workouts saved:", workouts);
    return workouts;
  }
}

// Controller class
class AppController {
  constructor(repository) {
    this.repository = repository;
    this.workouts = this.repository.loadWorkouts();
  }

  getWorkouts() {
    return this.workouts;
  }

  addExercise(category, treinoName, newExercise) {
    if (!this.workouts[category]) {
      this.workouts[category] = [];
    }
    
    let treino = this.workouts[category].find(t => t.treino === treinoName);
    
    if (!treino) {
      treino = {
        treino: treinoName,
        exercises: []
      };
      this.workouts[category].push(treino);
    }
    
    treino.exercises.push(newExercise);
    this.repository.saveWorkouts(this.workouts);
    return this.workouts;
  }

  deleteExercise(category, exerciseId) {
    if (this.workouts[category]) {
      // Remove exercise from each treino
      this.workouts[category].forEach(treino => {
        treino.exercises = treino.exercises.filter(ex => ex.id !== exerciseId);
      });
      
      // Remove any empty treinos
      this.workouts[category] = this.workouts[category].filter(treino => treino.exercises.length > 0);
      
      this.repository.saveWorkouts(this.workouts);
    }
    return this.workouts;
  }
}

// YouTube Video Component
const YouTubeVideo = ({ title, youtubeUrl }) => {
  if (!youtubeUrl || youtubeUrl === '') {
    return null;
  }
  
  let videoId;
  if (youtubeUrl.includes('v=')) {
    videoId = youtubeUrl.split('v=')[1]?.split('&')[0];
  } else if (youtubeUrl.includes('youtu.be/')) {
    videoId = youtubeUrl.split('youtu.be/')[1]?.split('?')[0];
  }
  
  if (!videoId) {
    return <div style={{ color: 'red' }}>URL do YouTube inválido.</div>;
  }
  
  const embedUrl = `https://www.youtube.com/embed/${videoId}`;
  
  return (
    <div style={{ margin: '10px 0', padding: '10px', border: '1px solid #333', borderRadius: '5px', backgroundColor: '#1e1e1e' }}>
      <h3 style={{ margin: '0 0 10px 0' }}>{title}</h3>
      <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
        <iframe 
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: '4px' }} 
          src={embedUrl} 
          title={title} 
          frameBorder="0" 
          allowFullScreen 
        />
      </div>
    </div>
  );
};

// Exercise Card Component
const ExerciseCard = ({ exercise, onDelete, checkedExercises, onToggleCheck }) => {
  const [showVideo, setShowVideo] = useState(false);
  
  const isAllChecked = checkedExercises[exercise.id] && 
    checkedExercises[exercise.id].length === exercise.sets && 
    checkedExercises[exercise.id].every(Boolean);

  return (
    <div style={{ marginBottom: '15px', padding: '15px', border: '1px solid #333', borderRadius: '5px', backgroundColor: '#1e1e1e' }}>
      <h3 style={{ margin: '0 0 10px 0' }}>{exercise.name}</h3>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#252525', padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>
        <div><strong>Sets:</strong> {exercise.sets}</div>
        <div><strong>Reps:</strong> {exercise.reps}</div>
        <div><strong>Dificuldade:</strong> {exercise.difficulty}</div>
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
      
      <div style={{ display: 'flex', gap: '10px' }}>
        <button 
          onClick={() => onDelete(exercise.id)} 
          style={{ padding: '8px 12px', backgroundColor: '#dc004e', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          🗑️ Delete Exercise
        </button>
        
        {exercise.youtubeUrl && (
          <button 
            onClick={() => setShowVideo(!showVideo)} 
            style={{ padding: '8px 12px', backgroundColor: '#2196f3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            {showVideo ? '🎬 Hide Video' : '🎬 Show Video'}
          </button>
        )}
      </div>
      
      {showVideo && exercise.youtubeUrl && (
        <YouTubeVideo title={exercise.name} youtubeUrl={exercise.youtubeUrl} />
      )}
    </div>
  );
};

// Training List Item Component
const TrainingListItem = ({ treino, exerciseCount, isSelected, onClick }) => {
  return (
    <div 
      onClick={onClick}
      style={{ 
        padding: '15px', 
        marginBottom: '10px', 
        backgroundColor: isSelected ? '#333' : '#1e1e1e', 
        borderRadius: '5px',
        cursor: 'pointer',
        border: isSelected ? '1px solid #f44336' : '1px solid #333',
        transition: 'all 0.2s ease'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0 }}>{treino}</h3>
        <div style={{ 
          backgroundColor: '#f44336', 
          color: 'white', 
          borderRadius: '50%', 
          width: '24px', 
          height: '24px', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          fontSize: '14px',
          fontWeight: 'bold'
        }}>
          {exerciseCount}
        </div>
      </div>
    </div>
  );
};

// Workout Group Component
const WorkoutGroup = ({ treino, exercises, onDelete, checkedExercises, onToggleCheck }) => {
  return (
    <div style={{ marginBottom: '30px', border: '1px solid #333', borderRadius: '5px', overflow: 'hidden' }}>
      <div style={{ backgroundColor: '#252525', padding: '15px', borderBottom: '1px solid #333' }}>
        <h2 style={{ margin: 0 }}>{treino}</h2>
      </div>
      <div style={{ padding: '15px' }}>
        {exercises.map(exercise => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            onDelete={onDelete}
            checkedExercises={checkedExercises}
            onToggleCheck={onToggleCheck}
          />
        ))}
      </div>
    </div>
  );
};

// Timer Modal Component
const TimerModal = ({ isOpen, onClose }) => {
  const [timerValue, setTimerValue] = useState(30);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval;
    
    if (isRunning) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsRunning(false);
            alert("Tempo de descanso concluído!");
            onClose();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, onClose]);

  const handleStartTimer = () => {
    setTimeRemaining(timerValue);
    setIsRunning(true);
  };

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
      <div style={{ backgroundColor: '#333', padding: '20px', borderRadius: '8px', color: 'white', width: '300px' }}>
        <h2 style={{ marginTop: 0 }}>Timer de Descanso</h2>
        {isRunning ? (
          <div style={{ textAlign: 'center', margin: '20px 0' }}>
            <div style={{ fontSize: '48px', fontWeight: 'bold' }}>{timeRemaining}</div>
            <div>segundos restantes</div>
          </div>
        ) : (
          <>
            <div style={{ margin: '20px 0' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Segundos:</label>
              <input
                type="number"
                value={timerValue}
                onChange={(e) => setTimerValue(Math.max(1, parseInt(e.target.value) || 1))}
                style={{ padding: '8px', borderRadius: '5px', border: '1px solid #555', width: '100%', backgroundColor: '#222', color: 'white' }}
              />
            </div>
            <button onClick={handleStartTimer} style={{ padding: '10px 16px', backgroundColor: '#4caf50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', width: '100%', marginBottom: '10px' }}>
              Iniciar
            </button>
          </>
        )}
        <button onClick={onClose} style={{ padding: '10px 16px', backgroundColor: '#dc004e', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', width: '100%' }}>
          Cancelar
        </button>
      </div>
    </div>
  );
};

// Main App Component
const CalisthenicsApp = () => {
  // Initialize repository and controller
  const [repository] = useState(new DataRepository());
  const [controller] = useState(new AppController(repository));
  
  // App state
  const [selectedCategory, setSelectedCategory] = useState('push');
  const [workouts, setWorkouts] = useState({});
  const [isTimerModalOpen, setIsTimerModalOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedTreino, setSelectedTreino] = useState(null);
  const [newExercise, setNewExercise] = useState({
    treino: '',
    name: '',
    sets: 3,
    reps: '10',
    difficulty: 'Normal',
    youtubeUrl: ''
  });
  const [checkedExercises, setCheckedExercises] = useState({});

  // Load workouts on component mount
  useEffect(() => {
    const loadedWorkouts = controller.getWorkouts();
    setWorkouts(loadedWorkouts);
  }, [controller]);

  // Add new exercise handler
  const handleAddExercise = (e) => {
    e.preventDefault();
    
    if (newExercise.name && newExercise.treino) {
      const exercise = new Exercise(
        newExercise.treino,
        newExercise.name,
        parseInt(newExercise.sets),
        newExercise.reps,
        newExercise.difficulty,
        newExercise.youtubeUrl
      );
      
      const updatedWorkouts = controller.addExercise(selectedCategory, newExercise.treino, exercise);
      setWorkouts({...updatedWorkouts});
      
      // Clear form except treino field for quick consecutive additions
      setNewExercise({
        treino: newExercise.treino,
        name: '',
        sets: 3,
        reps: '10',
        difficulty: 'Normal',
        youtubeUrl: ''
      });
      
      // Set the newly added treino as selected
      setSelectedTreino(newExercise.treino);
    }
  };

  // Delete exercise handler
  const handleDeleteExercise = (id) => {
    const updatedWorkouts = controller.deleteExercise(selectedCategory, id);
    setWorkouts({...updatedWorkouts});
    
    // Remove the exercise from checked exercises
    const updatedCheckedExercises = {...checkedExercises};
    delete updatedCheckedExercises[id];
    setCheckedExercises(updatedCheckedExercises);
  };

  // Toggle exercise set completion
  const handleToggleCheck = (exerciseId, setIndex, isChecked) => {
    setCheckedExercises(prev => {
      const updatedChecks = {...prev};
      if (!updatedChecks[exerciseId]) {
        updatedChecks[exerciseId] = [];
      }
      updatedChecks[exerciseId][setIndex] = isChecked;
      return updatedChecks;
    });
  };

  // Get workouts for selected category
  const categoryWorkouts = workouts[selectedCategory] || [];
  
  // Reset selected treino when category changes
  useEffect(() => {
    setSelectedTreino(null);
  }, [selectedCategory]);
  
  // Update dropdown options when category changes
  useEffect(() => {
    if (categoryWorkouts.length > 0 && !newExercise.treino) {
      setNewExercise(prev => ({
        ...prev,
        treino: categoryWorkouts[0]?.treino || ''
      }));
    }
  }, [categoryWorkouts, newExercise.treino]);

  // Get the currently selected workout
  const selectedWorkout = selectedTreino 
    ? categoryWorkouts.find(workout => workout.treino === selectedTreino)
    : null;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', backgroundColor: '#121212', color: 'white', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Calistenia App</h1>
      
      {/* Action Buttons */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <button 
          onClick={() => setIsTimerModalOpen(true)}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#4caf50', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px', 
            cursor: 'pointer',
            fontSize: '16px',
            marginRight: '10px'
          }}
        >
          ⏱️ Timer de Descanso
        </button>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#2196f3', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px', 
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          {showAddForm ? '✖️ Fechar Formulário' : '➕ Adicionar Exercício'}
        </button>
      </div>
      
      {/* New Exercise Form */}
      {showAddForm && (
        <div style={{ backgroundColor: '#1e1e1e', padding: '20px', borderRadius: '5px', marginBottom: '20px' }}>
          <h2 style={{ marginTop: 0 }}>Adicionar Novo Exercício</h2>
          <form onSubmit={handleAddExercise}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Treino:</label>
              <input 
                type="text" 
                value={newExercise.treino} 
                onChange={(e) => setNewExercise({...newExercise, treino: e.target.value})}
                style={{ padding: '8px', borderRadius: '5px', border: '1px solid #555', width: '100%', backgroundColor: '#222', color: 'white' }}
                required
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Nome do Exercício:</label>
              <input 
                type="text" 
                value={newExercise.name} 
                onChange={(e) => setNewExercise({...newExercise, name: e.target.value})}
                style={{ padding: '8px', borderRadius: '5px', border: '1px solid #555', width: '100%', backgroundColor: '#222', color: 'white' }}
                required
              />
            </div>
            <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Sets:</label>
                <input 
                  type="number" 
                  value={newExercise.sets} 
                  onChange={(e) => setNewExercise({...newExercise, sets: e.target.value})}
                  style={{ padding: '8px', borderRadius: '5px', border: '1px solid #555', width: '100%', backgroundColor: '#222', color: 'white' }}
                  min="1"
                  required
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px' }}>Reps:</label>
                <input 
                  type="text" 
                  value={newExercise.reps} 
                  onChange={(e) => setNewExercise({...newExercise, reps: e.target.value})}
                  style={{ padding: '8px', borderRadius: '5px', border: '1px solid #555', width: '100%', backgroundColor: '#222', color: 'white' }}
                  required
                />
              </div>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Dificuldade:</label>
              <select 
                value={newExercise.difficulty} 
                onChange={(e) => setNewExercise({...newExercise, difficulty: e.target.value})}
                style={{ padding: '8px', borderRadius: '5px', border: '1px solid #555', width: '100%', backgroundColor: '#222', color: 'white' }}
              >
                <option value="Easy">Fácil</option>
                <option value="Normal">Normal</option>
                <option value="Hard">Difícil</option>
                <option value="Sayajin">Sayajin</option>
              </select>
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>URL do YouTube:</label>
              <input 
                type="url" 
                value={newExercise.youtubeUrl} 
                onChange={(e) => setNewExercise({...newExercise, youtubeUrl: e.target.value})}
                style={{ padding: '8px', borderRadius: '5px', border: '1px solid #555', width: '100%', backgroundColor: '#222', color: 'white' }}
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>
            <button 
              type="submit" 
              style={{ padding: '10px 16px', backgroundColor: '#4caf50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', width: '100%' }}
            >
              Salvar Exercício
            </button>
          </form>
        </div>
      )}
      
      {/* Category Selection */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
        <button 
          onClick={() => setSelectedCategory('push')}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: selectedCategory === 'push' ? '#f44336' : '#333', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px', 
            cursor: 'pointer' 
          }}
        >
          Push
        </button>
        <button 
          onClick={() => setSelectedCategory('pull')}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: selectedCategory === 'pull' ? '#f44336' : '#333', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px', 
            cursor: 'pointer' 
          }}
        >
          Pull
        </button>
        <button 
          onClick={() => setSelectedCategory('legs')}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: selectedCategory === 'legs' ? '#f44336' : '#333', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px', 
            cursor: 'pointer' 
          }}
        >
          Legs
        </button>
        <button 
          onClick={() => setSelectedCategory('abs')}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: selectedCategory === 'abs' ? '#f44336' : '#333', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px', 
            cursor: 'pointer' 
          }}
        >
          Abs
        </button>
      </div>
      
      {/* Workout Lists and Details */}
      <div style={{ display: 'flex', gap: '20px' }}>
        {/* Training List */}
        <div style={{ flex: '1', minWidth: '250px' }}>
          <h2 style={{ marginBottom: '15px' }}>Treinos de {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}</h2>
          
          {categoryWorkouts.length > 0 ? (
            <div>
              {categoryWorkouts.map(workout => (
                <TrainingListItem 
                  key={workout.treino}
                  treino={workout.treino}
                  exerciseCount={workout.exercises.length}
                  isSelected={selectedTreino === workout.treino}
                  onClick={() => setSelectedTreino(workout.treino)}
                />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#1e1e1e', borderRadius: '5px' }}>
              <p>Nenhum treino encontrado para esta categoria.</p>
            </div>
          )}
        </div>
        
        {/* Exercise Details */}
        <div style={{ flex: '2' }}>
          {selectedWorkout ? (
            <div>
              <h2 style={{ marginBottom: '15px' }}>Exercícios de {selectedWorkout.treino}</h2>
              <div style={{ padding: '15px', backgroundColor: '#1e1e1e', borderRadius: '5px' }}>
                {selectedWorkout.exercises.map(exercise => (
                  <ExerciseCard
                    key={exercise.id}
                    exercise={exercise}
                    onDelete={handleDeleteExercise}
                    checkedExercises={checkedExercises}
                    onToggleCheck={handleToggleCheck}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#1e1e1e', borderRadius: '5px' }}>
              <p>Selecione um treino para ver os exercícios.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Timer Modal */}
      <TimerModal isOpen={isTimerModalOpen} onClose={() => setIsTimerModalOpen(false)} />
    </div>
  );
};

export default CalisthenicsApp;