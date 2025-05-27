import { IonButton, IonButtons, IonContent, IonHeader, IonIcon,IonList, IonItem, IonLabel, IonMenuToggle, IonMenuButton, IonPage, IonMenu,IonTitle, IonToolbar, useIonToast } from '@ionic/react';
import { homeOutline, refreshOutline,barbellOutline, settingsOutline, peopleOutline, listOutline, analyticsOutline, notificationsOutline } from 'ionicons/icons';



/* Páginas */
import QuizGamePage from '../pages/quizzgame/QuizzGame';
import AlarmeClockPage from '../pages/clockPage/alarm_clock_page';
import TaskManagerPage from '../pages/todoList/task_manager';
import CalisthenicsApp from '../pages/calistenia_app/pages/calistenia_app_mui';
import MarkdownChecklist from '../pages/CheckListMarkdown/MarkdownCheckList';
import React from 'react';


export const appRoutes = [
    //{ path: '/home', component: GohanTreinamentosHomePage, label: 'Home', icon: homeOutline },
    { path: '/calistenia', component: CalisthenicsApp, label: 'Calistenia', icon: barbellOutline },
     { path: '/quizz', component: QuizGamePage, label: 'Quizz', icon: peopleOutline },
     { path: '/tasks', component: TaskManagerPage, label: 'Tarefas', icon: listOutline },
     { path: '/alarme', component: AlarmeClockPage, label: 'Alarme', icon: analyticsOutline },
     { path: '/checklist', component: MarkdownChecklist, label: 'Checklist', icon: notificationsOutline },
  ];

  
const SidebarMenu: React.FC = () => {

    return (
      <IonMenu contentId="main" type="overlay">
        <IonHeader>
          <IonToolbar>
            <IonTitle>Menu Lateral</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonList>
            {appRoutes.map((item, index) => (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem routerLink={item.path} routerDirection="forward" lines="none">
                  <IonIcon slot="start" icon={item.icon} />
                  <IonLabel>{item.label}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            ))}
          </IonList>
        </IonContent>
      </IonMenu>
    );
  };

export default SidebarMenu;