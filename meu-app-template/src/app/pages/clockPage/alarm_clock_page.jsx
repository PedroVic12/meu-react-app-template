import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonButton,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonToolbar,
  IonItem,
  IonLabel,
  IonToggle,
  IonIcon,
  IonList,
  IonListHeader,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
} from '@ionic/react';
import { trashOutline, alarmOutline, volumeMuteOutline, volumeHighOutline, closeCircleOutline } from 'ionicons/icons';
import {
  Container,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  ListItemSecondaryAction,
  Slide,
} from '@mui/material';
import styled from '@emotion/styled';

const StyledIonHeader = styled(IonHeader)`
  ion-toolbar {
    --background: #f0f0f0;
    color: #333;
  }
`;

const StyledIonContent = styled(IonContent)`
  --background: #fff;
`;

const TimeDisplay = styled(Typography)`
  font-size: 3rem;
  font-weight: bold;
  text-align: center;
  margin-top: 20px;
  margin-bottom: 30px;
  color: #2c3e50;
`;

const AlarmFormBox = styled(Box)`
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const AlarmSelectItem = styled(IonItem)`
  margin-bottom: 10px;
`;

const AlarmButton = styled(IonButton)`
  margin-top: 20px;
  --background: #3498db;
  --color: white;
  --padding-start: 30px;
  --padding-end: 30px;
`;

const AlarmListItem = styled(IonItem)`
  --padding-start: 15px;
  --inner-padding-end: 15px;
  border-left: 5px solid #3498db;
  margin-bottom: 8px;
  border-radius: 5px;
`;

const AlarmListLabel = styled(IonLabel)`
  h2 {
    font-weight: bold;
    color: #333;
    margin-bottom: 5px;
  }
  p {
    color: #777;
    font-size: 0.9em;
  }
`;

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});


function AlarmeClockPage() {
  const [time, setTime] = useState("");
  const [alarms, setAlarms] = useState(() => {
    const storedAlarms = localStorage.getItem('alarms');
    return storedAlarms ? JSON.parse(storedAlarms) : [];
  });
  const [error, setError] = useState(null);
  const audioRef = useRef(null);
  const [activeAlarmId, setActiveAlarmId] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState('');


  const playAlarm = useCallback((soundUrl) => {
    if (audioRef.current) {
      audioRef.current.src = soundUrl;
      audioRef.current.play().catch(e => console.error("Falha ao tocar o áudio:", e));
    }
  }, []);

  const stopAllAlarms = useCallback((alarmId) => {
    console.log("stopAllAlarms foi chamada para alarmId:", alarmId);
    setActiveAlarmId(null);
    if (audioRef.current) {
      console.log("audioRef.current existe:", audioRef.current);
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      console.log("Áudio pausado e currentTime resetado.");

      setAlarms(prevAlarms =>
        prevAlarms.map(alarm =>
          alarm.id === alarmId ? { ...alarm, isActive: false } : alarm
        )
      );
      console.log("Alarme desativado na lista (se encontrado).");
    } else {
      console.log("audioRef.current é null ou undefined!");
    }
  }, [setActiveAlarmId, setAlarms]);


  useEffect(() => {
    localStorage.setItem('alarms', JSON.stringify(alarms));
  }, [alarms]);


  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const currentTime = now.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });
      setTime(currentTime);
      console.log("Current Time:", currentTime);

      alarms.forEach(alarm => {
        if (alarm.isActive && alarm.time === currentTime && alarm.id !== activeAlarmId) {
          console.log("Alarme deve tocar! Alarm ID:", alarm.id, "ActiveAlarmId:", activeAlarmId);
          setActiveAlarmId(alarm.id);
          playAlarm(alarm.soundUrl);
        }
      });
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, [alarms, activeAlarmId, playAlarm]);


  const addAlarm = useCallback(async (hour, minute, file) => {
    if (!hour || !minute || !file) {
      setError("Por favor, selecione hora, minuto e um arquivo de som.");
      return;
    }

    // **Cria URL local para o arquivo selecionado**
    const soundUrl = URL.createObjectURL(file);

    const newAlarm = {
      id: Date.now(),
      time: `${hour}:${minute}`,
      soundUrl,
      isActive: true,
      soundName: file.name,
    };

    setAlarms((prev) => [...prev, newAlarm]);
    setError(null);
    setSelectedFileName('');


  }, [setAlarms]);


  const toggleAlarm = useCallback((id) => {
    setAlarms((prev) =>
      prev.map((alarm) =>
        alarm.id === id ? { ...alarm, isActive: !alarm.isActive } : alarm,
      ),
    );
    setActiveAlarmId(null);
    stopAllAlarms(activeAlarmId);
  }, [setAlarms, stopAllAlarms, setActiveAlarmId]);

  const removeAlarm = useCallback((id) => {
    setAlarms((prev) => prev.filter((alarm) => alarm.id !== id));
    setActiveAlarmId(null);
    stopAllAlarms(activeAlarmId);
  }, [setAlarms, stopAllAlarms, setActiveAlarmId]);



  return (
    <IonPage>
      <StyledIonHeader>
        <IonToolbar>
          <IonTitle>
            <TimeDisplay>{time}</TimeDisplay>
          </IonTitle>
        </IonToolbar>
      </StyledIonHeader>
      <StyledIonContent className="ion-padding">
        <Container maxWidth="md">
          <AlarmFormBox>
          <Typography variant="h6" gutterBottom style={{ color: 'black' }}>
              Adicionar Novo Alarme
          </Typography  >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                addAlarm(
                  formData.get("hour"),
                  formData.get("minute"),
                  formData.get("sound"),
                );
                e.target.reset();
                setSelectedFileName('');
              }}
            >
              <Box display="flex" gap={2} alignItems="center" mb={2}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel id="hour-label">Hora</InputLabel>
                  <Select labelId="hour-label" id="hour-select" name="hour" label="Hora" defaultValue="08" required>
                    {[...Array.from({ length: 24 })].map((_, i) => (
                      <MenuItem key={i} value={i.toString().padStart(2, "0")}>
                        {i.toString().padStart(2, "0")}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl variant="outlined" fullWidth>
                  <InputLabel id="minute-label">Minuto</InputLabel>
                  <Select labelId="minute-label" id="minute-select" name="minute" label="Minuto" defaultValue="00" required>
                    {[...Array.from({ length: 60 })].map((_, i) => (
                      <MenuItem key={i} value={i.toString().padStart(2, "0")}>
                        {i.toString().padStart(2, "0")}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Box mb={2}>
                <Button
                  component="label"
                  variant="outlined"
                  fullWidth
                >
                  Selecionar Som do Alarme
                  <VisuallyHiddenInput
                    type="file"
                    name="sound"
                    accept=".mp3,audio/*"
                    required
                    onChange={(e) => {
                      const file = e.target.files ? e.target.files[0] : null;
                      setSelectedFileName(file ? file.name : '');
                    }}
                  />
                </Button>
                {selectedFileName && (
                  <Typography variant="body2" style={{ fontStyle: 'italic', color: 'green', marginTop: '5px' }}>
                    Arquivo selecionado: {selectedFileName}
                  </Typography>
                )}
              </Box>


              <AlarmButton type="submit" expand="block" >
                Adicionar Alarme
              </AlarmButton>
              {error && <Typography color="error" style={{ textAlign: 'center', marginTop: '10px' }}>Erro: {error}</Typography>}


            </form>
          </AlarmFormBox>


          <IonList>
            <IonListHeader lines="full">
              <IonLabel>Alarmes</IonLabel>
            </IonListHeader>

            {alarms.map((alarm) => (
              <Slide key={alarm.id} direction="up" in={true} mountOnEnter unmountOnExit>
                <IonItemSliding >
                  <AlarmListItem>
                    <AlarmListLabel>
                      <h2>{alarm.time}</h2>
                      <p>Som: {alarm.soundName}</p>
                    </AlarmListLabel>
                    <ListItemSecondaryAction>
                      <IonToggle
                        value="active"
                        checked={alarm.isActive}
                        onIonChange={() => toggleAlarm(alarm.id)}
                        slot="end"
                        aria-label={alarm.isActive ? 'Desativar Alarme' : 'Ativar Alarme'}
                        ios={{
                          on: <IonIcon icon={volumeHighOutline} />,
                          off: <IonIcon icon={volumeMuteOutline} />
                        }}
                        md={{
                          on: <IonIcon icon={volumeHighOutline} />,
                          off: <IonIcon icon={volumeMuteOutline} />
                        }}
                      />
                    </ListItemSecondaryAction>
                  </AlarmListItem>
                  <IonItemOptions side="end">
                    <IonItemOption
                      expandable
                      color="danger"
                      onClick={() => removeAlarm(alarm.id)}
                    >
                      <IonIcon icon={trashOutline} slot="icon-only"></IonIcon>
                    </IonItemOption>
                  </IonItemOptions>
                </IonItemSliding>
              </Slide>
            ))}
          </IonList>


          <audio ref={audioRef} loop={false} />

          {alarms.length > 0 && activeAlarmId && (
            <Button
              onClick={() => stopAllAlarms(activeAlarmId)} // **PASSANDO activeAlarmId PARA stopAllAlarms**
              variant="contained"
              color="error"
              startIcon={<IonIcon icon={volumeMuteOutline} />}
              sx={{ mt: 2 }}
            >
              Parar Alarme Tocando
            </Button>
          )}


        </Container>
      </StyledIonContent>
    </IonPage>
  );
}

export default AlarmeClockPage;