// App.tsx
import {
    IonApp,
    IonIcon,
    IonLabel,
    IonRouterOutlet,
    IonTabBar,
    IonTabButton,
    IonTabs,
    IonSplitPane,
    setupIonicReact,
  } from '@ionic/react';
  import { Redirect, Route, useLocation } from 'react-router-dom';
  
  import {
    analyticsOutline,
    barbellOutline,
    homeOutline,
    listOutline,
    notificationsOutline,
    peopleOutline,
    settingsOutline
  } from 'ionicons/icons';
  
  /* Páginas */
  import GohanTreinamentosGeradorTreinoPage from './app/pages/geradorTreinoPage';
  import GohanTreinamentosHomePage from './app/pages/HomePage/gohan_treinamentos_homepage';
  import QuizGamePage from './app/pages/quizzgame/QuizzGame';
  import AlarmeClockPage from './app/pages/clockPage/alarm_clock_page';
  import TaskManagerPage from './app/pages/todoList/task_manager';
  import CalisthenicsApp from './app/pages/calistenia_app/pages/calistenia_app_mui';
  import MarkdownChecklist from './app/pages/CheckListMarkdown/MarkdownCheckList';
  import SidebarMenu from './app/widgets/side_menu';
  
  /* CSS */
  import '@ionic/react/css/core.css';
  import '@ionic/react/css/normalize.css';
  import '@ionic/react/css/structure.css';
  import '@ionic/react/css/typography.css';
  import '@ionic/react/css/padding.css';
  import '@ionic/react/css/float-elements.css';
  import '@ionic/react/css/text-alignment.css';
  import '@ionic/react/css/text-transformation.css';
  import '@ionic/react/css/flex-utils.css';
  import '@ionic/react/css/display.css';
  import '@ionic/react/css/palettes/dark.system.css';
  import './theme/variables.css';
  
  setupIonicReact();
  
  
  export const appRoutes = [
    { path: '/home', component: GohanTreinamentosHomePage, label: 'Home', icon: homeOutline },
    { path: '/calistenia', component: CalisthenicsApp, label: 'Calistenia', icon: barbellOutline },
    { path: '/treinos', component: GohanTreinamentosGeradorTreinoPage, label: 'Treinos', icon: settingsOutline },
    { path: '/quizz', component: QuizGamePage, label: 'Quizz', icon: peopleOutline },
    { path: '/tasks', component: TaskManagerPage, label: 'Tarefas', icon: listOutline },
    { path: '/alarme', component: AlarmeClockPage, label: 'Alarme', icon: analyticsOutline },
    { path: '/checklist', component: MarkdownChecklist, label: 'Checklist', icon: notificationsOutline },
  ];
  







// --- Main App Component ---
const App = () => (
    <DarkModeProvider>
        <SessionProvider>
            <ToastProvider>
                <BrowserRouter>
                    <MainLayout>
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/profile" element={<ProfilePage />} />
                            <Route path="/settings" element={<SettingsPage />} />
                            <Route path="/workout" element={<WorkoutPage />} />

                            
                            {/* <Route path="/agenda" element={<AgendaContatosPage />} /> */}

                            <Route path="/stock-manager" element={<StockManagerpage />} /> 
                            {/* <Route path="/lembrete_app" element={<LembreteApp />} /> */}

                            <Route path="*" element={<NotFoundPage />} />
                        </Routes>
                    </MainLayout>
                </BrowserRouter>
            </ToastProvider>
        </SessionProvider>
    </DarkModeProvider>
);

export default App;
