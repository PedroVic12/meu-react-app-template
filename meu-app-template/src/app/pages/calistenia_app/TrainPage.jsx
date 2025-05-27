// src/app/pages/CalisteniaAppPage.jsx

import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardContent, IonCheckbox, IonLabel } from '@ionic/react';

const exercicios = {
  'TREINO DE COSTAS': [
    { nome: 'Pull ups', repeticoes: 10, series: 2 },
    { nome: 'Chin ups', repeticoes: 10, series: 1 },
    { nome: 'Chin ups Hold', repeticoes: 10, series: 1 },
    { nome: 'Close Grip Pull ups', repeticoes: 10, series: 1 },
    { nome: 'Close Grip Chin ups', repeticoes: 10, series: 1 },
    
    { nome: 'Pull ups Ipen and Close', repeticoes: 10, series: 1 },
  
    { nome: 'Pull ups Front Lever', repeticoes: 10, series: 1 },

    { nome: 'Pull ups Chin Up Slow', repeticoes: 10, series: 1 },

    { nome: 'Pull ups Side to Side', repeticoes: 10, series: 2 },

    { nome: 'Pull ups Slow', repeticoes: 10, series: 1 },


    // ... (continue com os exercícios de costas)
  ],
  'TREINO DE PEITO': [
    { nome: 'Supino', repeticoes: 10, series: 3 },
    { nome: 'Supino Inclinado', repeticoes: 10, series: 3 },
    // ... (continue com os exercícios de peito)
  ],
  // ... (adicione outros grupos musculares)
};

const TrainPage = () => {
  const [exerciciosConcluidos, setExerciciosConcluidos] = useState({});

  const toggleExercicio = (nomeExercicio) => {
    setExerciciosConcluidos(prev => ({
      ...prev,
      [nomeExercicio]: !prev[nomeExercicio]
    }));
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Calistenia APP react Version 1.0.1 </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {Object.keys(exercicios).map(grupo => (
          <IonCard key={grupo}>
            <IonCardContent>
              <h2>{grupo}</h2>
              {exercicios[grupo].map(exercicio => (
                <div key={exercicio.nome}>
                  <IonCheckbox
                    checked={exerciciosConcluidos[exercicio.nome] || false}
                    onIonChange={() => toggleExercicio(exercicio.nome)}
                  />
                  <IonLabel>{`${exercicio.nome} - ${exercicio.repeticoes}x${exercicio.series}`}</IonLabel>
                </div>
              ))}
            </IonCardContent>
          </IonCard>
        ))}
      </IonContent>
    </IonPage>
  );
};

export default TrainPage;