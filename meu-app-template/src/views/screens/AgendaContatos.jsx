import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@mui/material';

// --- Componente para Adicionar Contatos ---
const EditorDeContatos = ({ onAdd }) => {
    const [contato, setContato] = useState({ nome: '', telefone: '', email: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd(contato); // Adiciona o contato
        setContato({ nome: '', telefone: '', email: '' }); // Reseta o formulário
    };

    return (
        <div>
            <h2>Editor de Contatos</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="nome"
                    placeholder="Nome"
                    value={contato.nome}
                    onChange={(e) => setContato((prev) => ({ ...prev, nome: e.target.value }))}
                    required
                />
                <input
                    type="tel"
                    name="telefone"
                    placeholder="Telefone"
                    value={contato.telefone}
                    onChange={(e) => setContato((prev) => ({ ...prev, telefone: e.target.value }))}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="E-mail"
                    value={contato.email}
                    onChange={(e) => setContato((prev) => ({ ...prev, email: e.target.value }))}
                />
                <button type="submit">Adicionar Contato</button>
            </form>
        </div>
    );
};

// --- Componente para Exibir Detalhes do Contato ---
const Post = ({ contatos }) => {
    const { id } = useParams(); // Obtém o ID do contato pela URL
    const contato = contatos[id] || {}; // Busca o contato pelo ID

    return (
        <div>
            <h2>Detalhes do Contato</h2>
            <p>Nome: {contato.nome}</p>
            <p>Telefone: {contato.telefone}</p>
            <p>Email: {contato.email || 'Não informado'}</p>
            <Link to="/">Voltar</Link>
        </div>
    );
};

// --- Componente para Página Não Encontrada ---
const NotFound = () => (
    <div>
        <h2>Página não encontrada</h2>
        <Link to="/">Voltar para Home</Link>
    </div>
);

// --- Página Principal da Agenda de Contatos ---
const AgendaContatosPage = () => {
    const [contatos, setContatos] = useState([]);

    const handleAddContato = (novoContato) => {
        setContatos((prev) => [...prev, novoContato]); // Adiciona o novo contato à lista
    };

    return (
        <QueryClientProvider client={new QueryClient()}>
            <TooltipProvider>
                <Router>
                    <div>
                        <h1>Minha Agenda de Contatos</h1>
                        <Routes>
                            {/* Rota para a página principal */}
                            <Route
                                path="/"
                                element={
                                    <>
                                        <EditorDeContatos onAdd={handleAddContato} />
                                        <h2>Lista de Contatos</h2>
                                        <ul>
                                            {contatos.map((contato, index) => (
                                                <li key={index}>
                                                    <Link to={`/contato/${index}`}>{contato.nome}</Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </>
                                }
                            />
                            {/* Rota para exibir detalhes de um contato */}
                            <Route path="/contato/:id" element={<Post contatos={contatos} />} />
                            {/* Rota para página não encontrada */}
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </div>
                </Router>
            </TooltipProvider>
        </QueryClientProvider>
    );
};

export default AgendaContatosPage;