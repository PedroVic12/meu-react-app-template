import React, { useState, useRef, useEffect } from "react";
import {
  IonApp,
  IonRouterOutlet,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonContent,
  IonPage,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonButton,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonToast,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router-dom";
import { time, alarm } from "ionicons/icons";
import { Filesystem, Directory } from "@capacitor/filesystem";

const ClockPage = () => {
  const [time, setTime] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Relógio</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <h1 style={{ textAlign: "center", fontSize: "3rem" }}>{time}</h1>
      </IonContent>
    </IonPage>
  );
};

const AlarmsPage = () => {
  const [alarms, setAlarms] = useState([]);
  const [error, setError] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const audioRef = useRef(null);

  const playAlarm = (soundUrl) => {
    if (audioRef.current) {
      audioRef.current.src = soundUrl;
      audioRef.current.play();
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const currentTime = new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      alarms.forEach((alarm) => {
        if (alarm.time === currentTime && alarm.isActive) {
          playAlarm(alarm.soundUrl);
          setToastMessage(`Alarme disparado: ${alarm.time}`);
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [alarms]);

  const handleSoundUpload = async (file) => {
    try {
      const base64 = await toBase64(file);
      const fileName = `${Date.now()}-${file.name}`;
      await Filesystem.writeFile({
        path: fileName,
        data: base64,
        directory: Directory.Documents,
      });
      return `data:audio/mpeg;base64,${base64}`;
    } catch (e) {
      setError("Erro ao fazer upload do arquivo.");
      return null;
    }
  };

  const addAlarm = async (hour, minute, second, file) => {
    const soundUrl = await handleSoundUpload(file);
    if (!soundUrl) return;

    const newAlarm = {
      id: Date.now(),
      time: `${hour}:${minute}:${second}`,
      soundUrl,
      isActive: true,
      soundName: file.name,
    };

    setAlarms((prev) => [...prev, newAlarm]);
    setToastMessage("Alarme adicionado com sucesso!");
  };

  const toggleAlarm = (id) => {
    setAlarms((prev) =>
      prev.map((alarm) =>
        alarm.id === id ? { ...alarm, isActive: !alarm.isActive } : alarm
      )
    );
  };

  const removeAlarm = (id) => {
    setAlarms((prev) => prev.filter((alarm) => alarm.id !== id));
    setToastMessage("Alarme removido!");
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Alarmes</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            addAlarm(
              formData.get("hour"),
              formData.get("minute"),
              formData.get("second"),
              formData.get("sound")
            );
            e.target.reset();
          }}
        >
          <div className="ion-margin-bottom">
            <IonItem>
              <IonSelect name="hour" placeholder="Hora">
                {[...Array(24)].map((_, i) => (
                  <IonSelectOption key={i} value={i.toString().padStart(2, "0")}>
                    {i.toString().padStart(2, "0")}
                  </IonSelectOption>
                ))}
              </IonSelect>
              <IonSelect name="minute" placeholder="Minuto">
                {[...Array(60)].map((_, i) => (
                  <IonSelectOption key={i} value={i.toString().padStart(2, "0")}>
                    {i.toString().padStart(2, "0")}
                  </IonSelectOption>
                ))}
              </IonSelect>
              <IonSelect name="second" placeholder="Segundo">
                {[...Array(60)].map((_, i) => (
                  <IonSelectOption key={i} value={i.toString().padStart(2, "0")}>
                    {i.toString().padStart(2, "0")}
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>
          </div>
          <IonItem>
            <input type="file" name="sound" accept=".mp3" required />
          </IonItem>
          <IonButton expand="block" type="submit">
            Adicionar Alarme
          </IonButton>
        </form>
        <IonList>
          {alarms.map((alarm) => (
            <IonItem key={alarm.id}>
              <div>
                <p>{alarm.time}</p>
                <p>{alarm.soundName}</p>
              </div>
              <IonButton onClick={() => toggleAlarm(alarm.id)}>
                {alarm.isActive ? "Ativo" : "Inativo"}
              </IonButton>
              <IonButton color="danger" onClick={() => removeAlarm(alarm.id)}>
                Remover
              </IonButton>
            </IonItem>
          ))}
        </IonList>
        <audio ref={audioRef} />
        <IonToast
          isOpen={!!toastMessage}
          message={toastMessage}
          duration={2000}
          onDidDismiss={() => setToastMessage("")}
        />
      </IonContent>
    </IonPage>
  );
};

const App = () => (
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route path="/clock" component={ClockPage} exact />
          <Route path="/alarms" component={AlarmsPage} exact />
          <Redirect exact from="/" to="/clock" />
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="clock" href="/clock">
            <IonIcon icon={time} />
            <IonLabel>Relógio</IonLabel>
          </IonTabButton>
          <IonTabButton tab="alarms" href="/alarms">
            <IonIcon icon={alarm} />
            <IonLabel>Alarmes</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export default App;
