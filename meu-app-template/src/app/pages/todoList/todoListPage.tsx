import {
    IonLabel,
    IonButton,
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonItem,
    IonList,
    IonCheckbox,
    IonInput,
} from '@ionic/react';
import { useState } from 'react';

const TodoListPage: React.FC = () => {
    // Estado para armazenar as tarefas
    const [tasks, setTasks] = useState < { id: number; name: string; completed: boolean }[] > ([
        { id: 1, name: "Enviar curriculo ingels e portugues (UFF, DEV, DOLAR)", completed: false },


    ]);

    const [newTaskName, setNewTaskName] = useState("");

    const handleCheckboxChange = (id: number) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === id ? { ...task, completed: !task.completed } : task
            )
        );
    };

    const handleAddTask = () => {
        if (newTaskName.trim()) {
            const newTask = {
                id: tasks.length + 1,
                name: newTaskName,
                completed: false,
            };
            setTasks((prev) => [...prev, newTask]);
            setNewTaskName(""); // Limpa o campo de entrada
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonTitle>Minha Lista de Tarefas</IonTitle>
            </IonHeader>
            <IonContent>
                <IonInput
                    placeholder="Adicionar nova tarefa"
                    value={newTaskName}
                    onIonChange={(e) => setNewTaskName(e.detail.value!)}
                />
                <IonButton onClick={handleAddTask} color="primary">
                    Adicionar
                </IonButton>

                <IonList>
                    {tasks.map((task) => (
                        <IonItem key={task.id}>
                            <IonCheckbox
                                checked={task.completed}
                                onIonChange={() => handleCheckboxChange(task.id)}
                            />
                            <IonLabel className={task.completed ? "line-through" : ""}>
                                {task.name}
                            </IonLabel>
                        </IonItem>
                    ))}
                </IonList>

            </IonContent>
        </IonPage>
    );




};

export default TodoListPage;
