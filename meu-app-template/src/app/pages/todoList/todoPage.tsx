import React, { useState, useCallback } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonList,
  IonItem,
  IonLabel,
  IonCard,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonProgressBar,
  IonToolbar,
  IonButtons,
  IonMenuButton,
} from "@ionic/react";
import { 
  Checkbox,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Box
} from "@mui/material";

const TodoPageDashboard: React.FC = () => {
  const [exercises, setExercises] = useState([
    {
      id: 1,
      name: "Revisão Teórica",
      items: [
        "Teorema de Thévenin",
        "Análise de malhas",
        "Análise nodal",
        "Leis de Kirchhoff",
        "Conceitos básicos de circuitos",
      ],
    },
    {
      id: 2,
      name: "Seleção dos Exercícios",
      items: [
        "Identificar capítulo do Sadiku",
        "Escolher 25 exercícios variados",
        "Priorizar exercícios combinados",
      ],
    },
    {
      id: 3,
      name: "Resolução dos Exercícios",
      items: [
        "Ler enunciado atentamente",
        "Desenhar circuito",
        "Escolher método adequado",
        "Aplicar método escolhido",
        "Verificar resposta",
      ],
    },
    {
      id: 4,
      name: "Análise dos Resultados",
      items: [
        "Comparar diferentes soluções",
        "Identificar padrões",
        "Analisar dificuldades",
      ],
    },
  ]);

  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({});
  const [stats, setStats] = useState({
    totalCompleted: 0,
    totalItems: 0,
    progress: 0,
  });

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

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Gerador de Treino</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent className="ion-padding">
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Exercícios do Dia
            </Typography>
            <IonList>
              {exercises.map((exercise) => (
                <Card key={exercise.id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {exercise.name}
                    </Typography>
                    {exercise.items.map((item, index) => {
                      const isChecked = completedItems[`${exercise.id}-${index}`];
                      return (
                        <IonItem key={index} lines="none">
                          <Checkbox
                            checked={isChecked}
                            onChange={() => handleCheck(exercise.id, index)}
                          />
                          <IonLabel>{item}</IonLabel>
                        </IonItem>
                      );
                    })}
                  </CardContent>
                </Card>
              ))}
            </IonList>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Dashboard
            </Typography>
            <Box sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1">Progresso</Typography>
                <Typography variant="body1" fontWeight="bold">
                  {stats.progress}%
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={stats.progress} 
                sx={{ height: 10, borderRadius: 5 }}
              />
            </Box>

            <IonGrid>
              <IonRow>
                <IonCol>
                  <Box sx={{ bgcolor: '#e3f2fd', p: 2, borderRadius: 2 }}>
                    <Typography variant="h4" color="primary">
                      {stats.totalCompleted}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Completados
                    </Typography>
                  </Box>
                </IonCol>
                <IonCol>
                  <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 2 }}>
                    <Typography variant="h4" color="text.secondary">
                      {stats.totalItems}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total
                    </Typography>
                  </Box>
                </IonCol>
              </IonRow>
            </IonGrid>
          </CardContent>
        </Card>
      </IonContent>
    </IonPage>
  );
};

export default TodoPageDashboard;