import React, { useState, useEffect } from 'react';

// Data Repository Class
class DataRepository {
    constructor() {
      console.log("Initializing DataRepository");
      this.initialData = {
        // Direct access format with proper structure
        workouts: {
          Push: [
            { id: 'push-1', name: '100 Push ups - Chris Heria', sets: 5, reps: '10-15', youtubeUrl: 'https://www.youtube.com/watch?v=IYLxm0T6qls', difficulty: 'Normal' },
            { id: 'push-2', name: '5 minutes 30x30', sets: 2, reps: '30', youtubeUrl: '', difficulty: 'Normal' },
            { id: 'push-3', name: 'Moves of the day - treino de peito', sets: 4, reps: '12', youtubeUrl: 'https://www.youtube.com/watch?v=ypxmdLxCK7k', difficulty: 'Normal' }
          ],
          Pull: [
            { id: 'pull-1', name: '100 Pull ups - Chris Heria', sets: 3, reps: '10', youtubeUrl: '', difficulty: 'Normal' },
            { id: 'pull-2', name: 'Skin the Cat + Muscle Up', sets: 2, reps: '5-8', youtubeUrl: '', difficulty: 'Sayajin' },
            { id: 'pull-3', name: '5 minutes 30x30', sets: 2, reps: '30', youtubeUrl: '', difficulty: 'Normal' }
          ],
          Legs: [
            { id: 'legs-1', name: '100 Squads a Day', sets: 5, reps: '20', youtubeUrl: 'https://www.youtube.com/watch?v=qLPrPVz4NzQ', difficulty: 'Normal' }
          ],
          ABS: [
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
        }
      };
    }
  
    getInitialWorkouts() {
      console.log("Getting initial workouts");
      // Return the direct workouts format
      if (this.initialData.workouts) {
        console.log("Using new workouts format");
        return {...this.initialData.workouts};
      }
      
      // Legacy format conversion if the direct format doesn't exist
      console.log("Converting from legacy treinos format");
      const workouts = {};
      for (const category in this.initialData.treinos) {
        console.log(`Processing category: ${category}`);
        workouts[category] = Object.entries(this.initialData.treinos[category]).map(([key, value]) => {
          console.log(`Converting workout: ${value[0]}`);
          return {
            id: `${category.toLowerCase()}-${key}`,
            name: value[0],
            sets: value.length > 3 ? parseInt(value[3]) || 3 : 3, // Default to 3 sets if not specified
            reps: value.length > 4 ? value[4] : 'N/A',
            youtubeUrl: value[1] || '',
            difficulty: value[2] || 'Normal'
          };
        });
      }
      console.log("Converted workouts:", workouts);
      return workouts;
    }
  
    getTutorialVideos() {
      console.log("Getting tutorial videos");
      const videos = [];
      for (const category in this.initialData.TUTORIAL_YOUTUBE) {
        this.initialData.TUTORIAL_YOUTUBE[category].forEach((url, index) => {
          if (url) {
            console.log(`Adding tutorial video: ${category}-${index}`);
            videos.push({
              id: `${category}-${index}`,
              title: `Tutorial ${index + 1} - ${category}`,
              youtubeUrl: url,
              category: category
            });
          }
        });
      }
      console.log(`Total tutorial videos: ${videos.length}`);
      return videos;
    }
  
    loadWorkouts() {
      console.log("Loading workouts from localStorage");
      const savedWorkouts = localStorage.getItem('calisthenicsWorkouts');
      if (savedWorkouts) {
        console.log("Workouts found in localStorage");
        return JSON.parse(savedWorkouts);
      } else {
        console.log("No workouts found in localStorage, using initial data");
        return this.getInitialWorkouts();
      }
    }
  
    saveWorkouts(workouts) {
      console.log("Saving workouts to localStorage");
      localStorage.setItem('calisthenicsWorkouts', JSON.stringify(workouts));
    }
  
    loadCheckedExercises() {
      console.log("Loading checked exercises from localStorage");
      const savedCheckedExercises = localStorage.getItem('checkedExercises');
      return savedCheckedExercises ? JSON.parse(savedCheckedExercises) : {};
    }
  
    saveCheckedExercises(checkedExercises) {
      console.log("Saving checked exercises to localStorage");
      localStorage.setItem('checkedExercises', JSON.stringify(checkedExercises));
    }
  
    loadTrainingLog() {
      console.log("Loading training log from localStorage");
      const savedTrainingLog = localStorage.getItem('trainingLog');
      return savedTrainingLog ? JSON.parse(savedTrainingLog) : {};
    }
  
    saveTrainingLog(trainingLog) {
      console.log("Saving training log to localStorage");
      localStorage.setItem('trainingLog', JSON.stringify(trainingLog));
    }
  }
// Controller class
class AppController {
  constructor(repository) {
    this.repository = repository;
    this.workouts = this.repository.loadWorkouts();
    this.checkedExercises = this.repository.loadCheckedExercises();
    this.trainingLog = this.repository.loadTrainingLog();
    this.tutorialVideos = this.repository.getTutorialVideos();
  }

  getWorkouts() {
    return this.workouts;
  }

  getCheckedExercises() {
    return this.checkedExercises;
  }

  getTrainingLog() {
    return this.trainingLog;
  }

  getTutorialVideos() {
    return this.tutorialVideos;
  }

  toggleCheck(category, exerciseId, setIndex, checked) {
    if (!this.checkedExercises[exerciseId]) {
      const exercise = this.workouts[category].find(ex => ex.id === exerciseId);
      if (exercise) {
        this.checkedExercises[exerciseId] = Array(exercise.sets).fill(false);
      }
    }
    
    if (this.checkedExercises[exerciseId]) {
      this.checkedExercises[exerciseId][setIndex] = checked;
      this.repository.saveCheckedExercises(this.checkedExercises);
    }
    
    return this.checkedExercises;
  }

  deleteExercise(category, exerciseId) {
    this.workouts[category] = this.workouts[category].filter(ex => ex.id !== exerciseId);
    delete this.checkedExercises[exerciseId];
    this.repository.saveWorkouts(this.workouts);
    this.repository.saveCheckedExercises(this.checkedExercises);
    return this.workouts;
  }

  addExercise(category, newExercise) {
    this.workouts[category].push(newExercise);
    this.repository.saveWorkouts(this.workouts);
    return this.workouts;
  }
}

//! Components
//Youtube
const YouTubeVideo = ({ title, youtubeUrl }) => {
  const videoId = youtubeUrl.split('v=')[1]?.split('&')[0];

  if (!videoId) {
    return <div style={{ color: 'red' }}>URL do YouTube inválido.</div>;
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}`;

  return (
    <div style={{ margin: '10px 0', padding: '10px', border: '1px solid #333', borderRadius: '5px', backgroundColor: '#1e1e1e' }}>
      <h3 style={{ margin: '0 0 10px 0' }}>{title}</h3>
      <iframe 
        width="100%" 
        height="200" 
        src={embedUrl} 
        title={title} 
        frameBorder="0" 
        allowFullScreen
        style={{ borderRadius: '4px' }}
      />
    </div>
  );
};

// Exercise Component
const ExerciseCard = ({ exercise, checkedExercises, onToggleCheck, isEditing, onDelete }) => {
    return (
      <div 
        style={{ 
          marginBottom: '15px', 
          padding: '15px', 
          border: '1px solid #333', 
          borderRadius: '5px', 
          backgroundColor: '#1e1e1e'
        }}
      >
        <h3 style={{ margin: '0 0 10px 0' }}>{exercise.name}</h3>
        
        {/* Sets and Reps Info */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          backgroundColor: '#252525', 
          padding: '10px', 
          borderRadius: '4px',
          marginBottom: '15px'
        }}>
          <div>
            <strong>Sets:</strong> {exercise.sets}
          </div>
          <div>
            <strong>Reps:</strong> {exercise.reps}
          </div>
          {exercise.difficulty && (
            <div>
              <strong>Difficulty:</strong> {exercise.difficulty}
            </div>
          )}
        </div>
        
        {/* Sets Checkboxes */}
        <div style={{ marginBottom: '15px' }}>
          <h4 style={{ marginTop: 0, marginBottom: '10px' }}>Progress Tracking:</h4>
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '10px', 
            backgroundColor: '#252525',
            padding: '10px',
            borderRadius: '4px'
          }}>
            {Array.from({ length: exercise.sets }).map((_, setIndex) => (
              <label 
                key={setIndex} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '5px',
                  padding: '5px 10px',
                  backgroundColor: checkedExercises[exercise.id]?.[setIndex] ? '#1e4d2b' : '#333',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
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
        
        {/* YouTube Video */}
        {exercise.youtubeUrl && exercise.youtubeUrl.includes('youtube.com') && (
          <div style={{ marginBottom: '15px' }}>
            <h4 style={{ marginTop: 0, marginBottom: '10px' }}>Tutorial Video:</h4>
            <div style={{ 
              backgroundColor: '#252525',
              padding: '10px',
              borderRadius: '4px'
            }}>
              <a 
                href={exercise.youtubeUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: '#1976d2', textDecoration: 'none' }}
              >
                Watch on YouTube
              </a>
            </div>
          </div>
        )}
        
        {/* Delete Button */}
        {isEditing && (
          <button 
            onClick={() => onDelete(exercise.id)}
            style={{
              padding: '8px 12px',
              backgroundColor: '#dc004e',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <span>🗑️</span> Delete Exercise
          </button>
        )}
      </div>
    );
  };

const CalisthenicsApp = () => {
  // Initialize repository and controller
  const repository = new DataRepository()
  const controller = new AppController(repository)
  
  
  // State variables
  const [selectedTab, setSelectedTab] = useState('Push');
  const [workouts, setWorkouts] = useState(controller.getWorkouts());
  const [checkedExercises, setCheckedExercises] = useState(controller.getCheckedExercises());
  const [trainingLog, setTrainingLog] = useState(controller.getTrainingLog());
  const [tutorialVideos, setTutorialVideos] = useState(controller.getTutorialVideos());
  const [isEditing, setIsEditing] = useState(false);
  
  // Rest timer states
  const [timerDuration, setTimerDuration] = useState(30);
  const [remainingTime, setRemainingTime] = useState(30);
  const [timerActive, setTimerActive] = useState(false);
  
  // Form states for adding new exercise
  const [newExerciseName, setNewExerciseName] = useState('');
  const [newExerciseSets, setNewExerciseSets] = useState(1);
  const [newExerciseReps, setNewExerciseReps] = useState('');

  // Timer effect
  useEffect(() => {
    let interval;
    if (timerActive && remainingTime > 0) {
      interval = setInterval(() => {
        setRemainingTime(prevTime => prevTime - 1);
      }, 1000);
    } else if (remainingTime === 0) {
      setTimerActive(false);
      // You could add a sound effect here
    }
    
    return () => clearInterval(interval);
  }, [timerActive, remainingTime]);

  // Event handlers
  const handleToggleCheck = (exerciseId, setIndex, checked) => {
    const updatedCheckedExercises = controller.toggleCheck(selectedTab, exerciseId, setIndex, checked);
    setCheckedExercises({...updatedCheckedExercises});
  };

  const handleTabChange = (newValue) => {
    setSelectedTab(newValue);
  };

  const handleDeleteExercise = (category, exerciseId) => {
    const updatedWorkouts = controller.deleteExercise(category, exerciseId);
    setWorkouts({...updatedWorkouts});
  };

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
    setWorkouts({...updatedWorkouts});
    
    // Reset form
    setNewExerciseName('');
    setNewExerciseSets(1);
    setNewExerciseReps('');
  };

  const startTimer = () => {
    setRemainingTime(timerDuration);
    setTimerActive(true);
  };

  const resetTimer = () => {
    setTimerActive(false);
    setRemainingTime(timerDuration);
  };

  // Render functions
  const renderTabButtons = () => {
    const tabs = ['tutorials', 'Push', 'Pull', 'Legs', 'ABS', 'dashboard'];
    
    return (
      <div style={{ display: 'flex', overflowX: 'auto', backgroundColor: '#1e1e1e', borderRadius: '5px', marginBottom: '20px' }}>
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            style={{
              padding: '10px 20px',
              color: selectedTab === tab ? '#1976d2' : '#fff',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: selectedTab === tab ? '2px solid #1976d2' : 'none',
              cursor: 'pointer',
              fontWeight: selectedTab === tab ? 'bold' : 'normal',
              flex: '1 0 auto',
              textTransform: 'capitalize'
            }}
          >
            {tab}
          </button>
        ))}
      </div>
    );
  };

  const renderRestTimer = () => {
    return (
      <div style={{ 
        padding: '15px', 
        border: '1px solid #333', 
        borderRadius: '5px', 
        backgroundColor: '#1e1e1e',
        marginBottom: '20px'
      }}>
        <h3 style={{ margin: '0 0 10px 0' }}>
          Timer de Descanso: {remainingTime}s
        </h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={startTimer}
            style={{
              padding: '5px 10px',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <span>▶</span> Iniciar
          </button>
          <button 
            onClick={resetTimer}
            style={{
              padding: '5px 10px',
              backgroundColor: '#333',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <span>↻</span> Resetar
          </button>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="number"
              value={timerDuration}
              onChange={(e) => setTimerDuration(Number(e.target.value))}
              style={{ 
                width: '60px', 
                padding: '5px', 
                borderRadius: '5px', 
                border: '1px solid #555',
                backgroundColor: '#333',
                color: 'white'
              }}
            />
            <span style={{ marginLeft: '5px' }}>s</span>
          </div>
        </div>
      </div>
    );
  };

  const renderWorkoutTab = (category) => {
    const categoryWorkouts = workouts[category] || [];
    console.log(categoryWorkouts)
    for (let index = 0; index < categoryWorkouts.length; index++) {
        let element = categoryWorkouts[index];
        console.log(element)
        
    }
        
    return (
      <div style={{ padding: '20px' }}>
        <h2 style={{ marginTop: 0, textTransform: 'capitalize' }}> Treino: {category}</h2>

 
        

        {/*! Botao Editar */}
        <button 
          onClick={() => setIsEditing(!isEditing)}
          style={{
            marginBottom: '20px',
            padding: '8px 16px',
            backgroundColor: isEditing ? '#dc004e' : '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          {isEditing ? 'Concluir Edição' : 'Editar Treino'}
        </button>

           {/* Lista de exercícios */}
        {categoryWorkouts.map((exercise) => (
          <ExerciseCard 
            key={exercise.id} 
            exercise={exercise} 
            checkedExercises={checkedExercises} 
            onToggleCheck={handleToggleCheck} 
            isEditing={isEditing}
            onDelete={handleDeleteExercise}
          />
        ))}
        

    {/* Card de exercícios simples */}
        {categoryWorkouts.map((exercise) => (
          <div 
            key={exercise.id} 
            style={{ 
              marginBottom: '15px', 
              padding: '15px', 
              border: '1px solid #333', 
              borderRadius: '5px', 
              backgroundColor: '#1e1e1e'
            }}
          >

            <h3 style={{ margin: '0 0 5px 0' }}>{exercise.name}</h3>
            <div style={{ fontSize: '14px', color: '#aaa', marginBottom: '10px' }}>
              Sets: {exercise.sets} | Reps: {exercise.reps}
            </div>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '10px' }}>
              {Array.from({ length: exercise.sets }).map((_, setIndex) => (
                <label key={setIndex} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <input
                    type="checkbox"
                    checked={checkedExercises[exercise.id]?.[setIndex] || false}
                    onChange={(e) => handleToggleCheck(exercise.id, setIndex, e.target.checked)}
                  />
                  Set {setIndex + 1}
                </label>
              ))}
            </div>
            
            {isEditing && (
              <button 
                onClick={() => handleDeleteExercise(category, exercise.id)}
                style={{
                  padding: '5px 10px',
                  backgroundColor: '#dc004e',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <span>🗑️</span> Excluir
              </button>
            )}
          </div>
        ))}
        


        {/* adicionar e editar treino */}
        {isEditing && (
          <div 
            style={{ 
              marginBottom: '15px', 
              padding: '15px', 
              border: '1px solid #333', 
              borderRadius: '5px', 
              backgroundColor: '#1e1e1e'
            }}
          >
            <h3 style={{ margin: '0 0 10px 0' }}>Adicionar Exercício</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input
                type="text"
                placeholder="Nome do exercício"
                value={newExerciseName}
                onChange={(e) => setNewExerciseName(e.target.value)}
                style={{ 
                  padding: '8px', 
                  borderRadius: '5px', 
                  border: '1px solid #555',
                  backgroundColor: '#333',
                  color: 'white'
                }}
              />
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ width: '50%' }}>
                  <input
                    type="number"
                    placeholder="Sets"
                    value={newExerciseSets}
                    onChange={(e) => setNewExerciseSets(e.target.value)}
                    style={{ 
                      width: '100%',
                      padding: '8px', 
                      borderRadius: '5px', 
                      border: '1px solid #555',
                      backgroundColor: '#333',
                      color: 'white'
                    }}
                  />
                </div>
                <div style={{ width: '50%' }}>
                  <input
                    type="text"
                    placeholder="Reps"
                    value={newExerciseReps}
                    onChange={(e) => setNewExerciseReps(e.target.value)}
                    style={{ 
                      width: '100%',
                      padding: '8px', 
                      borderRadius: '5px', 
                      border: '1px solid #555',
                      backgroundColor: '#333',
                      color: 'white'
                    }}
                  />
                </div>
              </div>
              <button 
                onClick={() => handleAddExercise(category)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#4caf50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <span>+</span> Adicionar
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderDashboard = () => {
    return (
      <div style={{ padding: '20px' }}>
        <h2 style={{ marginTop: 0 }}>Registro de Treinos</h2>
        
        <div style={{ 
          marginBottom: '30px', 
          border: '1px solid #333', 
          borderRadius: '5px', 
          overflow: 'hidden',
          backgroundColor: '#1e1e1e'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#121212' }}>
                <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #333' }}>Data</th>
                <th style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #333' }}>Push</th>
                <th style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #333' }}>Pull</th>
                <th style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #333' }}>Legs</th>
                <th style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #333' }}>ABS</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(trainingLog).length > 0 ? (
                Object.entries(trainingLog).map(([date, log]) => (
                  <tr key={date}>
                    <td style={{ padding: '10px', borderBottom: '1px solid #333' }}>{date}</td>
                    <td style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #333' }}>{log.push ? '✅' : '❌'}</td>
                    <td style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #333' }}>{log.pull ? '✅' : '❌'}</td>
                    <td style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #333' }}>{log.legs ? '✅' : '❌'}</td>
                    <td style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #333' }}>{log.abs ? '✅' : '❌'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ padding: '10px', textAlign: 'center' }}>Nenhum treino registrado</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <h2 style={{ marginTop: '30px' }}>Volume de Treino</h2>
        <div style={{ 
          border: '1px solid #333', 
          borderRadius: '5px', 
          overflow: 'hidden',
          backgroundColor: '#1e1e1e'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#121212' }}>
                <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #333' }}>Exercício</th>
                <th style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #333' }}>Sets</th>
                <th style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #333' }}>Reps</th>
                <th style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #333' }}>Volume</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(workouts).flatMap(([category, exercises]) =>
                exercises.map((exercise, index) => (
                  <tr key={`${category}-${index}`}>
                    <td style={{ padding: '10px', borderBottom: '1px solid #333' }}>{exercise.name}</td>
                    <td style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #333' }}>{exercise.sets}</td>
                    <td style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #333' }}>{exercise.reps}</td>
                    <td style={{ padding: '10px', textAlign: 'center', borderBottom: '1px solid #333' }}>
                      {!isNaN(Number(exercise.reps)) 
                        ? exercise.sets * Number(exercise.reps) 
                        : 'N/A'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  
  const renderTutorials = () => {
    return (
      <div style={{ padding: '20px' }}>
        <h2 style={{ marginTop: 0 }}>Tutoriais</h2>
        
        {tutorialVideos.length > 0 ? (
          tutorialVideos.map(video => (
            <YouTubeVideo key={video.id} title={video.title} youtubeUrl={video.youtubeUrl} />
          ))
        ) : (
          <div style={{ padding: '20px', textAlign: 'center' }}>Nenhum tutorial disponível</div>
        )}
      </div>
    );
  };

  return (
    <div style={{ 
      backgroundColor: '#121212',
      minHeight: '100vh',
      color: 'white',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '30px', paddingTop: '20px' }}>
          Calistenia Workout App
        </h1>
        
        {renderTabButtons()}
        
        {['Push', 'Pull', 'Legs', 'ABS'].includes(selectedTab) && renderRestTimer()}
        
        <div style={{ 
          backgroundColor: '#1e1e1e',
          borderRadius: '5px',
          overflow: 'hidden'
        }}>
          {selectedTab === 'tutorials' && renderTutorials()}
          {selectedTab === 'Push' && renderWorkoutTab('Push')}
          {selectedTab === 'Pull' && renderWorkoutTab('Pull')}
          {selectedTab === 'Legs' && renderWorkoutTab('Legs')}
          {selectedTab === 'ABS' && renderWorkoutTab('ABS')}
          {selectedTab === 'dashboard' && renderDashboard()}
        </div>
      </div>
    </div>
  );
};

export default CalisthenicsApp;