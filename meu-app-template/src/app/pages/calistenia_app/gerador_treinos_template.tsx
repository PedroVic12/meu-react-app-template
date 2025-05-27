import React, { useState, useCallback } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonItem,
  IonLabel,
  IonCheckbox,
  IonButton,
  IonInput,
  IonTextarea,
  IonGrid,
  IonRow,
  IonCol,
  IonProgressBar,
} from '@ionic/react';

const TrainGeneratorPage: React.FC = () => {
  const [exercises, setExercises] = useState([
    {
      id: 1,
      name: "Peito e Tríceps",
      items: [
        "Supino Reto 4x12",
        "Supino Inclinado 3x12",
        "Extensão de Tríceps 4x15",
        "Flexão de Braço 3x falha",
      ],
    },
    {
      id: 2,
      name: "Costas e Bíceps",
      items: [
        "Puxada na Frente 4x12",
        "Remada Baixa 4x12",
        "Rosca Direta 3x15",
        "Rosca Martelo 3x12",
      ],
    },
  ]);

  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({});
  const [stats, setStats] = useState({
    totalCompleted: 0,
    totalItems: 0,
    progress: 0,
  });

  const [newExerciseName, setNewExerciseName] = useState("");
  const [newExerciseItems, setNewExerciseItems] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const handleCheck = useCallback((exerciseId: number, itemIndex: number) => {
    setCompletedItems((prev) => {
      const key = `${exerciseId}-${itemIndex}`;
      const newState = { ...prev, [key]: !prev[key] };

      const completed = Object.values(newState).filter(Boolean).length;
      const total = exercises.reduce((acc, ex) => acc + ex.items.length, 0);

      setStats({
        totalCompleted: completed,
        totalItems: total,
        progress: Math.round((completed / total) * 100),
      });

      return newState;
    });
  }, [exercises]);

  const handleAddExercise = () => {
    if (newExerciseName && newExerciseItems) {
      const newId = exercises.length + 1;
      const items = newExerciseItems.split(",").map((item) => item.trim());

      setExercises((prev) => [
        ...prev,
        {
          id: newId,
          name: newExerciseName,
          items: items,
        },
      ]);

      setNewExerciseName("");
      setNewExerciseItems("");
      setShowAddForm(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Gerador de Treino</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonGrid>
          <IonRow>
            <IonCol size="12" sizeMd="8">
              <IonCard>
                <IonCardHeader>
                  <div className="ion-padding-bottom ion-justify-content-between" style={{ display: 'flex', alignItems: 'center' }}>
                    <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>Treino do Dia</h2>
                    <IonButton 
                      onClick={() => setShowAddForm(!showAddForm)}
                      color={showAddForm ? "medium" : "primary"}
                    >
                      {showAddForm ? "Cancelar" : "Adicionar Treino"}
                    </IonButton>
                  </div>
                </IonCardHeader>

                <IonCardContent>
                  {showAddForm && (
                    <div className="ion-padding-bottom">
                      <IonItem>
                        <IonLabel position="stacked">Nome do treino</IonLabel>
                        <IonInput
                          value={newExerciseName}
                          onIonChange={e => setNewExerciseName(e.detail.value || "")}
                          placeholder="Ex: Treino de Pernas"
                        />
                      </IonItem>

                      <IonItem>
                        <IonLabel position="stacked">Exercícios (separados por vírgula)</IonLabel>
                        <IonTextarea
                          value={newExerciseItems}
                          onIonChange={e => setNewExerciseItems(e.detail.value || "")}
                          placeholder="Ex: Agachamento 3x12, Leg Press 4x15"
                        />
                      </IonItem>

                      <div className="ion-padding-top">
                        <IonButton expand="block" onClick={handleAddExercise} color="success">
                          Salvar Treino
                        </IonButton>
                      </div>
                    </div>
                  )}

                  {exercises.map((exercise) => (
                    <div key={exercise.id} className="ion-padding-bottom">
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: '1rem 0' }}>
                        {exercise.name}
                      </h3>
                      {exercise.items.map((item, index) => {
                        const isChecked = completedItems[`${exercise.id}-${index}`];
                        return (
                          <IonItem 
                            key={index}
                            className={isChecked ? 'ion-item-checked' : ''}
                            style={{
                              '--background': isChecked ? 'var(--ion-color-success-tint)' : 'var(--ion-color-light)',
                              marginBottom: '0.5rem',
                              borderRadius: '8px'
                            }}
                          >
                            <IonCheckbox
                              slot="start"
                              checked={isChecked}
                              onIonChange={() => handleCheck(exercise.id, index)}
                            />
                            <IonLabel>{item}</IonLabel>
                          </IonItem>
                        );
                      })}
                    </div>
                  ))}
                </IonCardContent>
              </IonCard>
            </IonCol>

            <IonCol size="12" sizeMd="4">
              <IonCard>
                <IonCardHeader>
                  <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold' }}>Dashboard</h2>
                </IonCardHeader>

                <IonCardContent>
                  <div className="ion-padding-bottom">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span>Progresso</span>
                      <strong>{stats.progress}%</strong>
                    </div>
                    <IonProgressBar 
                      value={stats.progress / 100}
                      style={{ height: '10px', borderRadius: '5px' }}
                    />
                  </div>

                  <IonGrid>
                    <IonRow>
                      <IonCol>
                        <div style={{ 
                          background: 'var(--ion-color-primary-tint)', 
                          padding: '1rem', 
                          borderRadius: '8px',
                          textAlign: 'center' 
                        }}>
                          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--ion-color-primary)' }}>
                            {stats.totalCompleted}
                          </div>
                          <div style={{ color: 'var(--ion-color-medium)' }}>Completados</div>
                        </div>
                      </IonCol>
                      <IonCol>
                        <div style={{ 
                          background: 'var(--ion-color-light)', 
                          padding: '1rem', 
                          borderRadius: '8px',
                          textAlign: 'center' 
                        }}>
                          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--ion-color-medium)' }}>
                            {stats.totalItems}
                          </div>
                          <div style={{ color: 'var(--ion-color-medium)' }}>Total</div>
                        </div>
                      </IonCol>
                    </IonRow>
                  </IonGrid>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default TrainGeneratorPage;