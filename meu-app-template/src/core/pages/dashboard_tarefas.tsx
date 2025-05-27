// src/App.jsx
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const tarefasPredefinidas = [
  { nome: "Estudo Eletromagnetismo", tempo: 7200 }, // 2h
  { nome: "Estudo Sinais e Sistemas", tempo: 5400 }, // 1h30
  { nome: "TCC - Pulseira Magnética", tempo: 3600 }, // 1h
  { nome: "Treino Físico", tempo: 1800 }, // 30min
  { nome: "Leitura Espiritual", tempo: 900 }, // 15min
];

export default function App() {
  const [tarefas, setTarefas] = useState(tarefasPredefinidas);
  const [tarefaAtual, setTarefaAtual] = useState(null);
  const [tempoRestante, setTempoRestante] = useState(0);
  const [rodando, setRodando] = useState(false);

  useEffect(() => {
    let timer;
    if (rodando && tempoRestante > 0) {
      timer = setInterval(() => {
        setTempoRestante((prev) => prev - 1);
      }, 1000);
    } else if (tempoRestante === 0 && rodando) {
      setRodando(false);
      alert("Tarefa concluída, mestre Pedro Victor!");
    }
    return () => clearInterval(timer);
  }, [rodando, tempoRestante]);

  const iniciarTarefa = (tarefa) => {
    setTarefaAtual(tarefa);
    setTempoRestante(tarefa.tempo);
    setRodando(true);
  };

  const formatarTempo = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Cronômetro Diário - Mestre Pedro Victor
      </h1>
      {tarefaAtual ? (
        <Card className="mb-4">
          <CardContent className="text-center">
            <h2 className="text-xl font-semibold">{tarefaAtual.nome}</h2>
            <p className="text-3xl font-mono my-2">{formatarTempo(tempoRestante)}</p>
            <Button onClick={() => setRodando(!rodando)} className="mr-2">
              {rodando ? "Pausar" : "Retomar"}
            </Button>
            <Button variant="destructive" onClick={() => {
              setRodando(false);
              setTarefaAtual(null);
            }}>
              Cancelar
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-2">
          {tarefas.map((t, idx) => (
            <Button key={idx} onClick={() => iniciarTarefa(t)}>
              Iniciar: {t.nome}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
