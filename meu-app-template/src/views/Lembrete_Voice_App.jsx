import React, { useState, useEffect } from 'react';
import { Button, TextField, Card, CardContent, Typography } from '@mui/material';

  const LembreteApp = () => {
  const [lembretes, setLembretes] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('lembretes')) || [];
    setLembretes(stored);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const agora = new Date();
      const atualizados = lembretes.map((l) => {
        const horario = new Date(l.dataHora);
        if (!l.notificado && horario <= agora) {
          notificar(l);
          return { ...l, notificado: true };
        }
        return l;
      });
      setLembretes(atualizados);
      localStorage.setItem('lembretes', JSON.stringify(atualizados));
    }, 30000);
    return () => clearInterval(interval);
  }, [lembretes]);

  const notificar = (lembrete) => {
    if ("Notification" in window) {
      new Notification("Lembrete!", { body: lembrete.titulo });
    }
    const utterance = new SpeechSynthesisUtterance(
      `Ei mestre Pedro Victor, está na hora de: ${lembrete.titulo}`
    );
    speechSynthesis.speak(utterance);
  };

  const adicionarLembrete = () => {
    const novo = {
      id: Date.now(),
      titulo,
      descricao,
      dataHora: new Date(Date.now() + 60000), // lembrete 1min depois
      notificado: false,
    };
    const atualizados = [...lembretes, novo];
    setLembretes(atualizados);
    localStorage.setItem('lembretes', JSON.stringify(atualizados));
    setTitulo('');
    setDescricao('');
  };

  const iniciarReconhecimentoVoz = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Seu navegador não suporta reconhecimento de voz.");

    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.start();
    recognition.onresult = (e) => {
      const comando = e.results[0][0].transcript;
      setTitulo(comando);
      setDescricao("Comando por voz detectado");
    };
  };

  return (
    <Card className="m-4 p-4">
      <CardContent>
        <Typography variant="h5">Lembretes por Voz</Typography>
        <TextField label="Título" fullWidth value={titulo} onChange={e => setTitulo(e.target.value)} margin="normal" />
        <TextField label="Descrição" fullWidth value={descricao} onChange={e => setDescricao(e.target.value)} margin="normal" />
        <Button variant="contained" color="primary" onClick={adicionarLembrete}>Criar Lembrete</Button>
        <Button variant="outlined" className="ml-2" onClick={iniciarReconhecimentoVoz}>Comando por Voz</Button>
        <div className="mt-4">
          {lembretes.map((l) => (
            <Typography key={l.id}>{l.titulo} - {new Date(l.dataHora).toLocaleString()}</Typography>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

