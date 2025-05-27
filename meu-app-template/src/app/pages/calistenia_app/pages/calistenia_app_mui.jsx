import React, { useState, useEffect,useRef } from 'react';

import { Box } from '@mui/material';


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
    <div style={styles.youtubeVideoContainer}>
      <h3 style={styles.youtubeVideoTitle}>{title}</h3>
      <div style={styles.youtubeVideoWrapper}>
        <iframe 
          style={styles.youtubeVideoFrame} 
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
    <div style={styles.exerciseCard}>
      <h3 style={styles.exerciseName}>{exercise.name}</h3>
      
      <div style={styles.exerciseInfo}>
        <div><strong>Sets:</strong> {exercise.sets}</div>
        <div><strong>Reps:</strong> {exercise.reps}</div>
        <div><strong>Dificuldade:</strong> {exercise.difficulty}</div>
      </div>
      
      <div style={styles.progressTracking}>
        <h4 style={styles.progressTitle}>Progress Tracking:</h4>
        <div style={styles.checkboxContainer}>
          {Array.from({ length: exercise.sets }).map((_, setIndex) => (
            <label key={setIndex} style={styles.checkboxLabel}>
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
            
      {/* Novo botão para mostrar/ocultar o vídeo */}
      <button style={
        showVideo ? styles.showVideoButton : styles.deleteButton
      } onClick={() => setShowVideo(!showVideo)}>
            {showVideo ? 'Ocultar Vídeo' : 'Mostrar Vídeo'}
      </button>
          
      {/* Mostra o vídeo se o estado showVideo for verdadeiro */}
      {showVideo && exercise.youtubeUrl && (
        <YouTubeVideo title={exercise.name} youtubeUrl={exercise.youtubeUrl} />
      )}
      

      {isAllChecked && (
        <div style={styles.completedMessage}>
          Treino concluído! 🎉
        </div>
      )}
      

    </div>
  );
};

// Training List Item Component
const TrainingListItem = ({ treino, exerciseCount, isSelected, onClick, onEdit, onTimer }) => {
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
        transition: 'all 0.2s ease',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
        <h3 style={{ margin: 0, fontSize: "16px" }}>{treino}</h3>
        <div style={{ 
          backgroundColor: '#f44336', 
          color: 'white', 
          borderRadius: '50%', 
          width: '24px', 
          height: '24px', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
        }}>
          {exerciseCount}
        </div>
      </div>
      <div style={{display: 'flex', gap: '10px'}}>
        <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent the main div's onClick from firing
              onEdit();
            }}
            style={styles.editButton}
          >
            Editar
        </button>
        <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent the main div's onClick from firing
              onTimer();
            }}
            style={styles.timerButtonSmall}
          >
            ⏱️
        </button>
      </div>
    </div>
  );
};

// Workout Group Component
const WorkoutGroup = ({ treino, exercises, onDelete, checkedExercises, onToggleCheck }) => {
  return (
    <div style={styles.workoutGroup}>
      <div style={styles.workoutGroupHeader}>
        <h2 style={{ margin: 0 }}>{treino}</h2>
      </div>
      <div style={styles.exerciseListContainer}>
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
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
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
                style={styles.modalInput}
              />
            </div>
            <button onClick={handleStartTimer} style={styles.modalButton}>
              Iniciar
            </button>
          </>
        )}
        <button onClick={onClose} style={styles.modalCancelButton}>
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
  const [editingTreino, setEditingTreino] = useState(null);

  // Função para recarregar a página
  const reloadPage = () => {
    window.location.reload();
  };

    // Usar useEffect para executar a função quando o componente for montado
    useEffect(() => {
      // Verificar se já existe um estado na sessão para indicar que a página foi recarregada
      if (!sessionStorage.getItem('paginaRecarregada')) {
        // Se não existir, definir o estado na sessão e recarregar a página
        sessionStorage.setItem('paginaRecarregada', 'true');
        window.location.reload();
      }
    }, []);
  

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
      setShowAddForm(false); // Close form after adding
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

  const handleEditTreino = (treinoName) => {
    setEditingTreino(treinoName);
    // Populate the form with the treino name for editing
    setNewExercise(prev => ({...prev, treino: treinoName}));
    setShowAddForm(true); // Show the form
  };

  const handleTimerTreino = () => {
    setIsTimerModalOpen(true);
  };
  return (
    

    <div style={styles.appContainer}>
     {/* <h1 style={styles.appTitle}>Calistenia App</h1> */}
     
     <Box
            sx={{
                mb: 2,
                display: "flex",
                flexDirection: "column",
                //height: 700,
                overflow: "hidden",
                overflowY: "scroll",
              }}
          >


      </Box>


      
      {/* New Exercise Form */}
      {showAddForm && (
        <div style={styles.formContainer}>
          <h2 style={{ marginTop: 0 }}>{editingTreino ? 'Editar Treino' : 'Adicionar Novo Exercício'}</h2>
          <form onSubmit={handleAddExercise}>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Treino:</label>
              <input 
                type="text" 
                value={newExercise.treino} 
                onChange={(e) => setNewExercise({...newExercise, treino: e.target.value})}
                style={styles.formInput}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Nome do Exercício:</label>
              <input 
                type="text" 
                value={newExercise.name} 
                onChange={(e) => setNewExercise({...newExercise, name: e.target.value})}
                style={styles.formInput}
                required
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Sets:</label>
                <input 
                  type="number" 
                  value={newExercise.sets} 
                  onChange={(e) => setNewExercise({...newExercise, sets: e.target.value})}
                  style={styles.formInput}
                  min="1"
                  required
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Reps:</label>
                <input 
                  type="text" 
                  value={newExercise.reps} 
                  onChange={(e) => setNewExercise({...newExercise, reps: e.target.value})}
                  style={styles.formInput}
                  required
                />
              </div>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>Dificuldade:</label>
              <select 
                value={newExercise.difficulty} 
                onChange={(e) => setNewExercise({...newExercise, difficulty: e.target.value})}
                style={styles.formInput}
              >
                <option value="Easy">Fácil</option>
                <option value="Normal">Normal</option>
                <option value="Hard">Difícil</option>
                <option value="Sayajin">Sayajin</option>
              </select>
            </div>
            <div style={styles.formGroup}>
              <label style={styles.formLabel}>URL do YouTube:</label>
              <input 
                type="url" 
                value={newExercise.youtubeUrl} 
                onChange={(e) => setNewExercise({...newExercise, youtubeUrl: e.target.value})}
                style={styles.formInput}
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>
            <button 
              type="submit" 
              style={styles.saveButton}
            >
              {editingTreino ? 'Atualizar Treino' : 'Salvar Exercício'}
            </button>
          </form>
        </div>
      )}
      
      {/* TABS for Category Selection */}
      <div style={styles.categoryButtonContainer}>
        <button 
          onClick={() => setSelectedCategory('push')}
          style={selectedCategory === 'push' ? styles.selectedCategoryButton : styles.categoryButton}
        >
          Push
        </button>
        <button 
          onClick={() => setSelectedCategory('pull')}
          style={selectedCategory === 'pull' ? styles.selectedCategoryButton : styles.categoryButton}
        >
          Pull
        </button>
        <button 
          onClick={() => setSelectedCategory('legs')}
          style={selectedCategory === 'legs' ? styles.selectedCategoryButton : styles.categoryButton}
        >
          Legs
        </button>
        <button 
          onClick={() => setSelectedCategory('abs')}
          style={selectedCategory === 'abs' ? styles.selectedCategoryButton : styles.categoryButton}
        >
          Abs
        </button>
      </div>
      

      {/* Workout Lists and Details */}
      <div style={styles.workoutContainer}>
        {/* Training List */}
        <div style={styles.trainingList}>
          <h2 >Treinos de {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}</h2>
          
          {categoryWorkouts.length > 0 ? (
            <div>
              {categoryWorkouts.map(workout => (
                <TrainingListItem 
                  key={workout.treino}
                  treino={workout.treino}
                  exerciseCount={workout.exercises.length}
                  isSelected={selectedTreino === workout.treino}
                  onClick={() => setSelectedTreino(workout.treino)}
                  onEdit={() => handleEditTreino(workout.treino)}
                  onTimer={() => {
                    setSelectedTreino(workout.treino); // Set selected treino for timer context
                    handleTimerTreino();
                  }}
                />
              ))}
            </div>
          ) : (
            <div style={styles.noWorkoutsMessage}>
              <p>Nenhum treino encontrado para esta categoria.</p>
            </div>
          )}
        </div>
       {/* Action Buttons */}
      <div style={styles.actionButtonContainer}>
        
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          style={styles.addExerciseButton}
        >
          {showAddForm ? '✖️ Fechar Formulário' : '➕ Adicionar Exercício'}
        </button>
      </div>
      
        {/* Exercise Details */}
        <div style={styles.exerciseDetails}>
          {selectedWorkout ? (
            <div>
              <h2 style={{ marginBottom: '5px' }}>Exercícios de {selectedWorkout.treino}</h2>
              <div style={styles.exerciseListWrapper}>
                <div style={styles.exerciseListContainer}>
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
            </div>
          ) : (
            <div style={styles.noWorkoutSelectedMessage}>
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

const styles = {
  appContainer: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#121212',
    color: 'white',
    minHeight: '100vh',
    //overflowX: 'hidden' // Mudança importante: overflowX para hidden
  },
  appTitle: {
    textAlign: 'center',
    marginBottom: '10px',
  },
  actionButtonContainer: {
    textAlign: 'center',
    marginBottom: '5px',
    display: 'flex',
    justifyContent: 'center'
  },
  timerButton: {
    padding: '10px 20px',
    backgroundColor: '#4caf50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    marginRight: '10px',
  },
    timerButtonSmall: {
    padding: '5px 10px',
    backgroundColor: '#4caf50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  addExerciseButton: {
    padding: '10px 20px',
    backgroundColor: '#2196f3',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  formContainer: {
    backgroundColor: '#1e1e1e',
    padding: '20px',
    borderRadius: '5px',
    marginBottom: '20px',
  },
  formGroup: {
    marginBottom: '15px',
  },
  formLabel: {
    display: 'block',
marginBottom: '5px',
  },
  formInput: {
    padding: '8px',
    borderRadius: '5px',
    border: '1px solid #555',
    width: '100%',
    backgroundColor: '#222',
    color: 'white',
    boxSizing: 'border-box'
  },
  saveButton: {
    padding: '10px 16px',
    backgroundColor: '#4caf50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    width: '100%',
  },
  categoryButtonContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    flexWrap: 'wrap'
  },
  categoryButton: {
    padding: '10px 20px',
    backgroundColor: '#333',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    flex: '1 0 auto',
    minWidth: '100px'
  },
  selectedCategoryButton: {
    padding: '10px 20px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    flex: '1 0 auto',
    minWidth: '100px'
  },
  workoutContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    overflowY: 'auto'

  },
   trainingList: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    padding: '20px',
    borderRadius: '5px',
    maxHeight: '600px',
    overflowY: 'auto',
  },
  
  exerciseDetails: {
    flex: '2',
  },
  noWorkoutsMessage: {
    textAlign: 'center',
    padding: '20px',
    backgroundColor: '#1e1e1e',
    borderRadius: '5px',
  },
  exerciseListWrapper: {  // New wrapper for horizontal scroll
    overflowX: 'auto',
    width: '100%',
    paddingBottom: '10px', // Add some padding at the bottom for scrollbar
    marginBottom: '15px'
  },
  exerciseListContainer: {
    flex: 1,
    gap: '15px',
    paddingBottom: '10px',
    overflowY: 'auto',
    maxHeight: '500px', /* Adicione esta linha */
  },
  noWorkoutSelectedMessage: {
    textAlign: 'center',
    padding: '40px',
    backgroundColor: '#1e1e1e',
    borderRadius: '5px',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#333',
    padding: '20px',
    borderRadius: '8px',
    color: 'white',
    width: '90%',
    maxWidth: '300px'
  },
  modalInput: {
    padding: '8px',
    borderRadius: '5px',
    border: '1px solid #555',
    width: '100%',
    backgroundColor: '#222',
    color: 'white',
    boxSizing: 'border-box'
  },
  modalButton: {
    padding: '10px 16px',
    backgroundColor: '#4caf50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    width: '100%',
    marginBottom: '10px',
  },
    modalCancelButton: {
    padding: '10px 16px',
    backgroundColor: '#dc004e',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    width: '100%'
  },
  exerciseCard: {
    marginBottom: '15px',
    padding: '15px',
    border: '1px solid #333',
    borderRadius: '5px',
    backgroundColor: '#1e1e1e',
    minWidth: '250px',
    maxWidth: '250px'
  },
  exerciseName: {
    margin: '0 0 10px 0',
  },
  exerciseInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: '#252525',
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '15px',
    flexWrap: 'wrap',
    gap: '10px'
  },
  progressTracking: {
    marginBottom: '15px',
  },
  progressTitle: {
    marginTop: 0,
    marginBottom: '10px',
  },
  checkboxContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  completedMessage: {
    marginBottom: '15px',
    padding: '10px',
    backgroundColor: '#4caf50',
    color: 'white',
    borderRadius: '4px',
    textAlign: 'center',
  },
  buttonContainer: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap'
  },
  deleteButton: {
    padding: '8px 12px',
    backgroundColor: '#dc004e',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    flex: '1 0 auto'
  },
  showVideoButton: {
    padding: '8px 12px',
    backgroundColor: '#2196f3',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    flex: '1 0 auto'
  },
  youtubeVideoContainer: {
    margin: '10px 0',
    padding: '10px',
    border: '1px solid #333',
    borderRadius: '5px',
    backgroundColor: '#1e1e1e',
  },
  youtubeVideoTitle: {
    margin: '0 0 10px 0',
  },
  youtubeVideoWrapper: {
    position: 'relative',
    paddingBottom: '56.25%',
    height: 0,
    overflow: 'hidden',
  },
  youtubeVideoFrame: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    borderRadius: '4px',
  },
    editButton: {
    padding: '5px 10px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  workoutGroup: {
    marginBottom: '30px',
    border: '1px solid #333',
    borderRadius: '5px',
    overflow: 'hidden'
  },
  workoutGroupHeader: {
    backgroundColor: '#252525',
    padding: '15px',
    borderBottom: '1px solid #333'
  }
};

export default CalisthenicsApp;

