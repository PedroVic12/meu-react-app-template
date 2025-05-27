import React, { useState, useEffect, useCallback } from 'react';
import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonButton,
    IonIcon,
    IonButtons,
    IonMenuButton,
} from '@ionic/react';
import { addOutline } from 'ionicons/icons';
import {
    Card,
    CardContent,
    CardHeader,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Grid,
    Button,
    Typography,
    Box,
    Container,
    Chip,
    IconButton,
    Menu,
    Fade,
} from '@mui/material';
import {
    Delete as DeleteIcon,
    Edit as EditIcon,
    MoreVert as MoreVertIcon,
    Close as CloseIcon,
} from '@mui/icons-material';
import SidebarMenu from '../../widgets/side_menu';

// --- Interfaces ---
interface Task {
    id: number;
    title: string;
    description: string;
    priority: 'baixa' | 'normal' | 'alta';
    dueDate: string;
    status: 'pendente' | 'em_progresso' | 'concluida';
}

interface CustomTextProps {
    text: string;
    color?: string;
}

interface TaskItemProps {
    task: Task;
    onEdit: (task: Task) => void;
    onDelete: (taskId: number) => void;
    onChangeStatus: (taskId: number, newStatus: Task['status']) => void;
}

interface TaskFormProps {
    task: Task;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
    onChange: (field: keyof Task, value: string) => void;
    isEditing: boolean;
}

interface TaskListProps {
    tasks: Task[];
    onEdit: (task: Task) => void;
    onDelete: (taskId: number) => void;
    onChangeStatus: (taskId: number, newStatus: Task['status']) => void;
}

// --- Constants ---
const LOCAL_STORAGE_KEY = "TAREFAS";

// --- Helper Components ---
const CustomText: React.FC<CustomTextProps> = ({ text, color = 'black' }) => { // Cor padrão preta
    return <span style={{ color }}>{text}</span>;
};

// --- TaskItem Component ---
const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit, onDelete, onChangeStatus }) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const menuOpen = Boolean(anchorEl);

    const handleMenuOpen = useCallback((event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    }, []);

    const handleMenuClose = useCallback(() => {
        setAnchorEl(null);
    }, []);

    const handleStatusChange = useCallback((status: Task['status']) => {
        onChangeStatus(task.id, status);
        handleMenuClose();
    }, [onChangeStatus, handleMenuClose, task.id]);

    const priorityColors = {
        baixa: '#8bc34a',
        normal: '#2196f3',
        alta: '#f44336'
    };

    const statusColors = {
        pendente: '#ff9800',
        em_progresso: '#2196f3',
        concluida: '#4caf50'
    };

    const statusLabels = {
        pendente: 'Pendente',
        em_progresso: 'Em Progresso',
        concluida: 'Concluída'
    };

    return (
        <Card sx={{ mb: 2, borderLeft: `4px solid ${priorityColors[task.priority]}` }}>
            <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Box flex={1}>
                        <Typography variant="h6" component="h3">
                            <CustomText text={task.title} color="black" />
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                            <CustomText text={task.description} color="black" />
                        </Typography>

                        <Box display="flex" mt={2} gap={1} flexWrap="wrap">
                            <Chip
                                label={<CustomText text={task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} color="black" />}
                                size="small"
                                sx={{ bgcolor: priorityColors[task.priority] }}
                            />
                            <Chip
                                label={<CustomText text={statusLabels[task.status]} color="black" />}
                                size="small"
                                sx={{ bgcolor: statusColors[task.status] }}
                            />
                            <Chip
                                label={<CustomText text={`Prazo: ${new Date(task.dueDate).toLocaleDateString('pt-BR')}`} color="black" />}
                                size="small"
                                variant="outlined"
                            />
                        </Box>
                    </Box>

                    <Box>
                        <IconButton aria-label="edit-task" size="small" onClick={() => onEdit(task)}>
                            <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton aria-label="delete-task" size="small" onClick={() => onDelete(task.id)}>
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                        <IconButton aria-label="open-status-menu" size="small" onClick={handleMenuOpen}>
                            <MoreVertIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </Box>

                <Menu
                    id="status-menu"
                    anchorEl={anchorEl}
                    open={menuOpen}
                    onClose={handleMenuClose}
                    TransitionComponent={Fade}
                >
                    <MenuItem onClick={() => handleStatusChange('pendente')}>
                        <CustomText text="Marcar como Pendente" color="black" />
                    </MenuItem>
                    <MenuItem onClick={() => handleStatusChange('em_progresso')}>
                        <CustomText text="Marcar como Em Progresso" color="black" />
                    </MenuItem>
                    <MenuItem onClick={() => handleStatusChange('concluida')}>
                        <CustomText text="Marcar como Concluída" color="black" />
                    </MenuItem>
                </Menu>
            </CardContent>
        </Card>
    );
};

// --- TaskForm Component ---
const TaskForm: React.FC<TaskFormProps> = ({ task, onSubmit, onCancel, onChange, isEditing }) => {
    return (
        <Card sx={{ mb: 4, position: 'relative' }}>
            <CardHeader
                title={<CustomText text={isEditing ? "Editar Tarefa" : "Nova Tarefa"} color="black" />}
                action={
                    <IconButton aria-label="cancel-form" onClick={onCancel}>
                        <CloseIcon />
                    </IconButton>
                }
            />
            <CardContent>
                <form onSubmit={onSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label={<CustomText text="Título" color="black" />}
                                value={task.title}
                                onChange={(e) => onChange('title', e.target.value)}
                                required
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label={<CustomText text="Descrição" color="black" />}
                                value={task.description}
                                onChange={(e) => onChange('description', e.target.value)}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel><CustomText text="Prioridade" color="black" /></InputLabel>
                                <Select
                                    value={task.priority}
                                    label={<CustomText text="Prioridade" color="black" />}
                                    onChange={(e) => onChange('priority', e.target.value as any)}
                                >
                                    <MenuItem value="baixa"><CustomText text="Baixa" color="black" /></MenuItem>
                                    <MenuItem value="normal"><CustomText text="Normal" color="black" /></MenuItem>
                                    <MenuItem value="alta"><CustomText text="Alta" color="black" /></MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth variant="outlined">
                                <InputLabel><CustomText text="Status" color="black" /></InputLabel>
                                <Select
                                    value={task.status}
                                    label={<CustomText text="Status" color="black" />}
                                    onChange={(e) => onChange('status', e.target.value as any)}
                                >
                                    <MenuItem value="pendente"><CustomText text="Pendente" color="black" /></MenuItem>
                                    <MenuItem value="em_progresso"><CustomText text="Em Progresso" color="black" /></MenuItem>
                                    <MenuItem value="concluida"><CustomText text="Concluída" color="black" /></MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                type="date"
                                label={<CustomText text="Data de Conclusão" color="black" />}
                                value={task.dueDate}
                                onChange={(e) => onChange('dueDate', e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                variant="outlined"
                            />
                        </Grid>
                        <Grid item xs={12} container justifyContent="flex-end" spacing={1}>
                            <Grid item>
                                <Button
                                    variant="outlined"
                                    onClick={onCancel}
                                    color="inherit"
                                    aria-label="cancel"
                                >
                                    <CustomText text="Cancelar" color="black" />
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    variant="contained"
                                    type="submit"
                                    color="primary"
                                    aria-label={isEditing ? 'atualizar' : 'adicionar'}
                                >
                                    <CustomText text={isEditing ? 'Atualizar' : 'Adicionar'} color="black" />
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </form>
            </CardContent>
        </Card>
    );
};

// --- TaskList Component ---
const TaskList: React.FC<TaskListProps> = ({ tasks, onEdit, onDelete, onChangeStatus }) => {
    const [filter, setFilter] = useState<string>('all');
    const [sortBy, setSortBy] = useState<string>('dueDate');
    const [renderedTasks, setRenderedTasks] = useState<Task[]>([]);

    useEffect(() => {
        let result = [...tasks];

        if (filter !== 'all') {
            result = result.filter(task => task.status === filter);
        }

        result.sort((a, b) => {
            switch (sortBy) {
                case 'priority':
                    const priorityOrder = { alta: 0, normal: 1, baixa: 2 };
                    return priorityOrder[a.priority] - priorityOrder[b.priority];
                case 'title':
                    return a.title.localeCompare(b.title);
                case 'dueDate':
                default:
                    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
            }
        });
        setRenderedTasks(result);
    }, [tasks, filter, sortBy]);

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" mb={3} gap={2}>
                {/* Filters and Sorting */}
                <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
                    <InputLabel><CustomText text="Filtrar por" color="black" /></InputLabel>
                    <Select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value as string)}
                        label={<CustomText text="Filtrar por" color="black" />}
                        aria-label="filter-tasks"
                    >
                        <MenuItem value="all"><CustomText text="Todas" color="black" /></MenuItem>
                        <MenuItem value="pendente"><CustomText text="Pendentes" color="black" /></MenuItem>
                        <MenuItem value="em_progresso"><CustomText text="Em Progresso" color="black" /></MenuItem>
                        <MenuItem value="concluida"><CustomText text="Concluídas" color="black" /></MenuItem>
                    </Select>
                </FormControl>

                <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
                    <InputLabel><CustomText text="Ordenar por" color="black" /></InputLabel>
                    <Select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as string)}
                        label={<CustomText text="Ordenar por" color="black" />}
                        aria-label="sort-tasks"
                    >
                        <MenuItem value="dueDate"><CustomText text="Data de Conclusão" color="black" /></MenuItem>
                        <MenuItem value="priority"><CustomText text="Prioridade" color="black" /></MenuItem>
                        <MenuItem value="title"><CustomText text="Título" color="black" /></MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {renderedTasks.length === 0 ? (
                <Typography variant="body1" color="textSecondary" align="center" sx={{ mt: 4 }}>
                    <CustomText text="Nenhuma tarefa encontrada." color="black" />
                </Typography>
            ) : (
                renderedTasks.map(task => (
                    <TaskItem
                        key={task.id}
                        task={task}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onChangeStatus={onChangeStatus}
                    />
                ))
            )}
        </Box>
    );
};

// --- TaskManagerPage Component ---
const TaskManagerPage: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTask, setNewTask] = useState<Task>({ // Mudança aqui: newTask agora é Task, não Omit<Task, 'id'>
        id: 0, // Adicionamos id: 0 como valor inicial
        title: '',
        description: '',
        priority: 'normal',
        dueDate: new Date().toISOString().split('T')[0],
        status: 'pendente',
    });
    const [isFormOpen, setIsFormOpen] = useState(false);

    // Load tasks from localStorage on component mount (SEM LOADING AGORA)
    useEffect(() => {
        try {
            const storedTasks = localStorage.getItem(LOCAL_STORAGE_KEY);
            const initialTasks = storedTasks ? JSON.parse(storedTasks) : [];
            setTasks(initialTasks);
        } catch (error) {
            console.error("Erro ao carregar tarefas do localStorage", error);
            setTasks([]); // Garante que tasks seja um array mesmo em caso de erro
        }
    }, []);

    // Save tasks to localStorage whenever tasks state changes
    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
    }, [tasks]);

    const handleAddTask = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        if (newTask.id !== 0) { // Verificamos se newTask.id é diferente de 0 (valor inicial) -> EDITAR
            // Editar tarefa existente
            const updatedTasks = tasks.map(task =>
                task.id === newTask.id ? newTask : task // Se o id da tarefa for igual ao id da newTask, atualiza com a newTask
            );
            setTasks(updatedTasks);
        } else { // ADICIONAR nova tarefa
            // Adicionar nova tarefa
            const newTaskWithId = { ...newTask, id: Date.now() };
            setTasks([...tasks, newTaskWithId]);
        }
        // Reset form e fechar
        setNewTask({ // Reseta newTask para o estado inicial (id: 0)
            id: 0,
            title: '',
            description: '',
            priority: 'normal',
            dueDate: new Date().toISOString().split('T')[0],
            status: 'pendente',
        });
        setIsFormOpen(false);
    }, [tasks, newTask, setTasks, setNewTask, setIsFormOpen]);

    const handleEditTask = useCallback((task: Task) => {
        setNewTask(task); // Preenche newTask com os dados da tarefa a ser editada
        setIsFormOpen(true);
    }, [setNewTask, setIsFormOpen]);

    const handleDeleteTask = useCallback((taskId: number) => {
        const updatedTasks = tasks.filter(task => task.id !== taskId);
        setTasks(updatedTasks);
    }, [tasks, setTasks]);

    const handleChangeTaskStatus = useCallback((taskId: number, newStatus: Task['status']) => {
        const updatedTasks = tasks.map(task =>
            task.id === taskId ? { ...task, status: newStatus } : task
        );
        setTasks(updatedTasks);
    }, [tasks, setTasks]);

    const handleTaskChange = useCallback((field: keyof Task, value: string) => {
        setNewTask(prevNewTask => ({ ...prevNewTask, [field]: value }));
    }, []);

    const handleCancelForm = useCallback(() => {
        setIsFormOpen(false);
        setNewTask({ // Reseta newTask para o estado inicial (id: 0)
            id: 0,
            title: '',
            description: '',
            priority: 'normal',
            dueDate: new Date().toISOString().split('T')[0],
            status: 'pendente',
        });
    }, [setIsFormOpen, setNewTask]);

    return (
        <>
            <SidebarMenu />
            <IonPage id="main-content">
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonMenuButton />
                        </IonButtons>
                        <IonTitle><CustomText text="Lista de Tarefas 2025" color="black" /></IonTitle>
                        <IonButtons slot="end">
                            <IonButton onClick={() => setIsFormOpen(true)} aria-label="add-new-task">
                                <IonIcon slot="start" icon={addOutline} />
                                <CustomText text="Nova Tarefa" color="black" />
                            </IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>

                <IonContent className="ion-padding">
                    <Container maxWidth="md">
                        <Fade in={isFormOpen} unmountOnExit>
                            <Box>
                                <TaskForm
                                    task={newTask} // Passamos newTask como a prop task para o Form
                                    onSubmit={handleAddTask}
                                    onCancel={handleCancelForm}
                                    onChange={handleTaskChange}
                                    isEditing={newTask.id !== 0} // isEditing será true se newTask.id for diferente de 0
                                />
                            </Box>
                        </Fade>

                        {/* TaskList SEM LOADING */}
                        <TaskList
                            tasks={tasks}
                            onEdit={handleEditTask}
                            onDelete={handleDeleteTask}
                            onChangeStatus={handleChangeTaskStatus}
                        />
                    </Container>
                </IonContent>
            </IonPage>
        </>
    );
};

export default TaskManagerPage;