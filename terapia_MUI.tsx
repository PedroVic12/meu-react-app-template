import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, TextField, Button, IconButton, List, ListItem, Paper, Typography,
  Drawer, AppBar, Toolbar, CssBaseline, ThemeProvider, createTheme,
  Card, CardContent, Grid
} from '@mui/material';
import { 
  VolumeUp, VolumeOff, Send, Menu, Chat, EditNote, Mood, Air,
  Inbox, CheckCircle, RadioButtonUnchecked, RadioButtonChecked
} from '@mui/icons-material';

// Configurações gerais
const GEMINI_API_KEY = "SUA_CHAVE_API_AQUI";
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-8b:generateContent";

// Tema personalizado
const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

// Controller com funções utilitárias
class Controller {
  static formatarResposta(texto: string): string {
    return texto
      .replace(/\*\*(.*?)\*\*|__(.*?)__/g, '<strong>$1$2</strong>')
      .replace(/\*(.*?)\*|_(.*?)_/g, '<em>$1$2</em>')
      .replace(/\n/g, '<br>')
      .replace(/^\s*[-*+]\s+(.*)$/gm, '<li>$1</li>')
      .replace(/(<li>.*?<\/li>)/gs, '<ul>$1</ul>')
      .replace(/>\s+</g, '><')
      .trim();
  }

  static async enviarMensagem(mensagem: string): Promise<string> {
    try {
      const response = await fetch(`${API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Você é a TerapIA, uma assistente terapêutica virtual especializada em oferecer suporte emocional. Suas principais características são:

1. EMPATIA: Você sempre demonstra compreensão e empatia com os sentimentos do usuário.
2. ACOLHIMENTO: Você cria um ambiente seguro e acolhedor para o diálogo.
3. PROFISSIONALISMO: Você mantém um tom profissional, mas caloroso e acessível.
4. ORIENTAÇÃO: Você oferece insights e sugestões práticas quando apropriado.
5. LIMITES: Você reconhece quando um assunto requer ajuda profissional e sugere buscar um terapeuta.

Aqui está a mensagem do usuário para você responder: ${mensagem}`
            }]
          }]
        })
      });

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      return 'Desculpe, ocorreu um erro ao processar sua mensagem.';
    }
  }

  static salvarLocalStorage(chave: string, dados: any): void {
    localStorage.setItem(chave, JSON.stringify(dados));
  }

  static carregarLocalStorage(chave: string): any {
    const dados = localStorage.getItem(chave);
    return dados ? JSON.parse(dados) : {};
  }
}

// Hook para síntese de voz
const useSpeechSynthesis = () => {
  const [vozSelecionada, setVozSelecionada] = useState<SpeechSynthesisVoice | null>(null);
  const [utteranceAtual, setUtteranceAtual] = useState<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const carregarVozes = () => {
      const vozes = window.speechSynthesis.getVoices();
      const vozThalita = vozes.find(voz => 
        voz.name.includes('Thalita') || 
        voz.lang.includes('pt')
      );
      setVozSelecionada(vozThalita || vozes[0] || null);
    };

    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = carregarVozes;
    }
    
    carregarVozes();
  }, []);

  const lerTexto = (texto: string) => {
    if (!vozSelecionada) return;
    
    cancelarLeitura();
    
    const utterance = new SpeechSynthesisUtterance(
      texto.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
    );
    
    utterance.voice = vozSelecionada;
    utterance.lang = 'pt-BR';
    utterance.rate = 1.0;
    
    utterance.onend = () => setUtteranceAtual(null);
    
    window.speechSynthesis.speak(utterance);
    setUtteranceAtual(utterance);
  };

  const cancelarLeitura = () => {
    if (utteranceAtual) {
      window.speechSynthesis.cancel();
      setUtteranceAtual(null);
    }
  };

  return { lerTexto, cancelarLeitura };
};

// Componente de Chat
const ChatInterface: React.FC<{leituraAtiva: boolean, setLeituraAtiva: React.Dispatch<React.SetStateAction<boolean>>}> = ({ 
  leituraAtiva, 
  setLeituraAtiva 
}) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Array<{role: string, content: string}>>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { lerTexto } = useSpeechSynthesis();

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    try {
      const resposta = await Controller.enviarMensagem(input);
      const assistantMessage = { role: 'assistant', content: resposta };
      setMessages(prev => [...prev, assistantMessage]);
      
      if (leituraAtiva) {
        lerTexto(resposta);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">TerapIA</Typography>
        <IconButton onClick={() => setLeituraAtiva(!leituraAtiva)}>
          {leituraAtiva ? <VolumeUp color="primary" /> : <VolumeOff />}
        </IconButton>
      </Box>
      
      <List sx={{ flexGrow: 1, overflow: 'auto', mb: 2, maxHeight: '70vh' }}>
        {messages.map((msg, index) => (
          <ListItem key={index} sx={{ justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <Paper 
              sx={{ 
                p: 2, 
                bgcolor: msg.role === 'user' ? 'primary.light' : 'background.paper',
                color: msg.role === 'user' ? 'primary.contrastText' : 'text.primary',
                maxWidth: '75%'
              }}
            >
              {msg.role === 'assistant' ? (
                <div dangerouslySetInnerHTML={{ __html: Controller.formatarResposta(msg.content) }} />
              ) : (
                msg.content
              )}
            </Paper>
          </ListItem>
        ))}
        <div ref={messagesEndRef} />
      </List>
      
      <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Digite sua mensagem..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <Button variant="contained" onClick={handleSend} endIcon={<Send />}>
          Enviar
        </Button>
      </Box>
    </Box>
  );
};

// Componente de Diário
const DiarioInterface: React.FC = () => {
  const hoje = new Date().toISOString().split('T')[0];
  const [data, setData] = useState(hoje);
  const [texto, setTexto] = useState('');

  useEffect(() => {
    const diarios = Controller.carregarLocalStorage('diarios');
    setTexto(diarios[data] || '');
  }, [data]);

  const salvarDiario = () => {
    if (!texto.trim()) {
      alert('Por favor, escreva algo no diário.');
      return;
    }
    
    const diarios = Controller.carregarLocalStorage('diarios');
    diarios[data] = texto;
    Controller.salvarLocalStorage('diarios', diarios);
    alert('Diário salvo com sucesso!');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '100%' }}>
      <TextField
        type="date"
        value={data}
        onChange={(e) => setData(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />
      
      <TextField
        multiline
        rows={15}
        placeholder="Como foi seu dia? O que você gostaria de registrar?"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        fullWidth
        sx={{ flexGrow: 1 }}
      />
      
      <Button 
        variant="contained" 
        onClick={salvarDiario}
        sx={{ alignSelf: 'flex-end', mt: 2 }}
        startIcon={<CheckCircle />}
      >
        Salvar Diário
      </Button>
    </Box>
  );
};

// Componente de Sentimentos
const SentimentosInterface: React.FC = () => {
  const hoje = new Date().toISOString().split('T')[0];
  const [data, setData] = useState(hoje);
  const [sentimento, setSentimento] = useState<number | null>(null);

  useEffect(() => {
    const sentimentos = Controller.carregarLocalStorage('sentimentos');
    setSentimento(sentimentos[data] !== undefined ? sentimentos[data] : null);
  }, [data]);

  const salvarSentimento = () => {
    if (sentimento === null) {
      alert('Por favor, selecione como você está se sentindo.');
      return;
    }
    
    const sentimentos = Controller.carregarLocalStorage('sentimentos');
    sentimentos[data] = sentimento;
    Controller.salvarLocalStorage('sentimentos', sentimentos);
    alert('Sentimento registrado com sucesso!');
  };

  const emojis = ['😢', '😕', '😐', '🙂', '😊', '😄'];
  const descricoes = [
    'Muito Triste', 
    'Triste', 
    'Neutro', 
    'Content', 
    'Feliz', 
    'Muito Feliz'
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, height: '100%' }}>
      <TextField
        type="date"
        value={data}
        onChange={(e) => setData(e.target.value)}
        fullWidth
      />
      
      <Typography variant="h6" align="center">
        Como você está se sentindo hoje?
      </Typography>
      
      <Grid container spacing={2} justifyContent="center">
        {emojis.map((emoji, index) => (
          <Grid item xs={4} sm={2} key={index}>
            <Card 
              sx={{ 
                textAlign: 'center',
                cursor: 'pointer',
                border: sentimento === index ? '2px solid #3f51b5' : '1px solid #ddd',
                bgcolor: sentimento === index ? '#e3f2fd' : 'background.paper'
              }}
              onClick={() => setSentimento(index)}
            >
              <CardContent>
                <Typography variant="h2">{emoji}</Typography>
                <Typography variant="body2">{descricoes[index]}</Typography>
                {sentimento === index ? (
                  <RadioButtonChecked color="primary" />
                ) : (
                  <RadioButtonUnchecked />
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      <Button 
        variant="contained" 
        onClick={salvarSentimento}
        sx={{ alignSelf: 'center', mt: 4, px: 4 }}
        startIcon={<CheckCircle />}
      >
        Salvar Sentimento
      </Button>
    </Box>
  );
};

// Componente de Respiração
const RespirarInterface: React.FC = () => {
  const [respiracaoAtiva, setRespiracaoAtiva] = useState(false);
  const [fase, setFase] = useState<'inspirar' | 'segurar' | 'expirar'>('inspirar');
  const [contador, setContador] = useState(5);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const iniciarRespiracao = () => {
    if (respiracaoAtiva) {
      pararRespiracao();
      return;
    }
    
    setRespiracaoAtiva(true);
    setFase('inspirar');
    setContador(5);
    
    timerRef.current = setInterval(() => {
      setContador(prev => {
        if (prev > 1) return prev - 1;
        
        // Transição entre fases
        if (fase === 'inspirar') {
          setFase('segurar');
          return 3;
        } else if (fase === 'segurar') {
          setFase('expirar');
          return 5;
        } else {
          pararRespiracao();
          alert('Ciclo de respiração completo! 🌟');
          return 0;
        }
      });
    }, 1000);
  };

  const pararRespiracao = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setRespiracaoAtiva(false);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const getFaseTexto = () => {
    switch (fase) {
      case 'inspirar': return 'Inspire 🌬️';
      case 'segurar': return 'Segure ⏸️';
      case 'expirar': return 'Expire 💨';
      default: return '';
    }
  };

  const getCorFase = () => {
    switch (fase) {
      case 'inspirar': return '#4caf50';
      case 'segurar': return '#ff9800';
      case 'expirar': return '#f44336';
      default: return '#3f51b5';
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100%',
      gap: 4
    }}>
      <Box sx={{
        width: 200,
        height: 200,
        borderRadius: '50%',
        bgcolor: getCorFase(),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 1s ease',
        transform: fase === 'inspirar' ? 'scale(1.2)' : fase === 'expirar' ? 'scale(0.8)' : 'scale(1)',
        color: 'white',
        flexDirection: 'column'
      }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          {getFaseTexto()}
        </Typography>
        <Typography variant="h2" sx={{ fontWeight: 'bold' }}>
          {contador}
        </Typography>
      </Box>
      
      <Button 
        variant="contained" 
        onClick={iniciarRespiracao}
        sx={{ px: 4, py: 2, fontSize: '1.2rem' }}
        color={respiracaoAtiva ? 'secondary' : 'primary'}
      >
        {respiracaoAtiva ? 'Parar Respiração' : 'Iniciar Respiração'}
      </Button>
      
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body1" sx={{ mb: 1 }}>
          Instruções:
        </Typography>
        <Typography variant="body2">
          1. Inspire profundamente por 5 segundos
        </Typography>
        <Typography variant="body2">
          2. Segure a respiração por 3 segundos
        </Typography>
        <Typography variant="body2">
          3. Expire lentamente por 5 segundos
        </Typography>
      </Box>
    </Box>
  );
};

// Componente principal
const ProdutividadePage: React.FC = () => {
  const [currentInterface, setCurrentInterface] = useState<'chat' | 'diario' | 'sentimentos' | 'respirar'>('chat');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [leituraAtiva, setLeituraAtiva] = useState(true);
  
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { id: 'chat', label: 'Chat', icon: <Chat /> },
    { id: 'diario', label: 'Diário', icon: <EditNote /> },
    { id: 'sentimentos', label: 'Sentimentos', icon: <Mood /> },
    { id: 'respirar', label: 'Respirar', icon: <Air /> }
  ];

  const drawer = (
    <Box sx={{ 
      width: 250, 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      bgcolor: '#3f51b5',
      color: 'white'
    }}>
      <Box sx={{ p: 2, textAlign: 'center', bgcolor: '#283593' }}>
        <Typography variant="h6">TerapIA</Typography>
        <Typography variant="subtitle2">Sua Assistente Emocional</Typography>
      </Box>
      
      <Box sx={{ flexGrow: 1, mt: 3 }}>
        {menuItems.map((item) => (
          <Button
            key={item.id}
            fullWidth
            startIcon={item.icon}
            onClick={() => {
              setCurrentInterface(item.id as any);
              if (mobileOpen) setMobileOpen(false);
            }}
            sx={{
              justifyContent: 'flex-start',
              px: 3,
              py: 1.5,
              color: 'white',
              bgcolor: currentInterface === item.id ? '#1a237e' : 'transparent',
              '&:hover': {
                bgcolor: currentInterface === item.id ? '#1a237e' : '#3949ab'
              }
            }}
          >
            {item.label}
          </Button>
        ))}
      </Box>
      
      <Box sx={{ p: 2, textAlign: 'center', bgcolor: '#1a237e' }}>
        <Typography variant="caption">Cuidando da sua saúde emocional</Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - 250px)` },
          ml: { sm: `250px` },
          bgcolor: 'primary.main',
          color: 'white'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <Menu />
          </IconButton>
          <Typography variant="h6" noWrap>
            {menuItems.find(i => i.id === currentInterface)?.label || 'TerapIA'}
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Box
        component="nav"
        sx={{ width: { sm: 250 }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          width: { sm: `calc(100% - 250px)` },
          marginTop: '64px'
        }}
      >
        {currentInterface === 'chat' && (
          <ChatInterface 
            leituraAtiva={leituraAtiva} 
            setLeituraAtiva={setLeituraAtiva} 
          />
        )}
        {currentInterface === 'diario' && <DiarioInterface />}
        {currentInterface === 'sentimentos' && <SentimentosInterface />}
        {currentInterface === 'respirar' && <RespirarInterface />}
      </Box>
    </Box>
  );
};

// App principal
const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ProdutividadePage />
    </ThemeProvider>
  );
};

export default App;