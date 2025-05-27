import React, { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonItem,
  IonLabel,
  IonCard,
  IonCardContent,
  IonList,
  IonListHeader,
  IonAlert,
} from '@ionic/react';

const TodoListPage = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "normal",
    dueDate: new Date().toISOString().split("T")[0],
    status: "pendente",
  });
  const [editingTask, setEditingTask] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (editingTask) {
      setTasks(
        tasks.map((task) =>
          task.id === editingTask.id ? { ...newTask, id: task.id } : task,
        ),
      );
      setEditingTask(null);
    } else {
      setTasks([...tasks, { ...newTask, id: Date.now() }]);
    }
    setNewTask({
      title: "",
      description: "",
      priority: "normal",
      dueDate: new Date().toISOString().split("T")[0],
      status: "pendente",
    });
    setIsFormOpen(false);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setNewTask(task);
    setIsFormOpen(true);
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const handleStatusChange = (taskId, newStatus) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task,
      ),
    );
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Lista de Tarefas</IonTitle>
          <IonButton slot="end" onClick={() => setIsFormOpen(true)}>
            Nova Tarefa
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {isFormOpen && (
          <IonCard>
            <IonCardContent>
              <form onSubmit={handleAddTask}>
                <IonItem>
                  <IonLabel position="stacked">Título</IonLabel>
                  <IonInput
                    value={newTask.title}
                    onIonChange={(e) =>
                      setNewTask({ ...newTask, title: e.detail.value || '' })
                    }
                    required
                  />
                </IonItem>
                <IonItem>
                  <IonLabel position="stacked">Descrição</IonLabel>
                  <IonTextarea
                    value={newTask.description}
                    onIonChange={(e) =>
                      setNewTask({ ...newTask, description:e.detail.value || ''})
                    }
                    rows={3}
                  />
                </IonItem>
                <IonItem>
                  <IonLabel>Prioridade</IonLabel>
                  <IonSelect
                    value={newTask.priority}
                    onIonChange={(e) =>
                      setNewTask({ ...newTask, priority: e.detail.value || '' })
                    }
                  >
                    <IonSelectOption value="baixa">Baixa</IonSelectOption>
                    <IonSelectOption value="normal">Normal</IonSelectOption>
                    <IonSelectOption value="alta">Alta</IonSelectOption>
                  </IonSelect>
                </IonItem>
                <IonItem>
                  <IonLabel>Data de Conclusão</IonLabel>
                  <IonInput
                    type="date"
                    value={newTask.dueDate}
                    onIonChange={(e) =>
                      setNewTask({ ...newTask, dueDate:e.detail.value || '' })
                    }
                  />
                </IonItem>
                <IonButton expand="full" type="submit">
                  {editingTask ? "Atualizar" : "Adicionar"}
                </IonButton>
                <IonButton expand="full" color="medium" onClick={() => setIsFormOpen(false)}>
                  Cancelar
                </IonButton>
              </form>
            </IonCardContent>
          </IonCard>
        )}

        <IonList>
          <IonListHeader>Tarefas</IonListHeader>
          {tasks.map((task) => (
            <IonCard key={task.id}>
              <IonCardContent>
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                <p>Prazo: {new Date(task.dueDate).toLocaleDateString("pt-BR")}</p>
                <IonSelect
                  value={task.status}
                  onIonChange={(e) => handleStatusChange(task.id, e.detail.value || '')}
                >
                  <IonSelectOption value="pendente">Pendente</IonSelectOption>
                  <IonSelectOption value="em_progresso">Em Progresso</IonSelectOption>
                  <IonSelectOption value="concluida">Concluída</IonSelectOption>
                </IonSelect>
                <IonButton onClick={() => handleEditTask(task)}>Editar</IonButton>
                <IonButton color="danger" onClick={() => handleDeleteTask(task.id)}>Excluir</IonButton>
              </IonCardContent>
            </IonCard>
          ))}
          {tasks.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <p>Nenhuma tarefa cadastrada</p>
            </div>
          )}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default TodoListPage;