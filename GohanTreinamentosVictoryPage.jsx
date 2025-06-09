import React, { useState, useEffect, useCallback } from 'react';
import { Download, Upload, Save, Trash2, Plus, Edit, FileText, Target, Code, BookOpen, Calendar, Star, Trophy, Lightbulb } from 'lucide-react';

// Hook personalizado para CRUD com localStorage
const useCrud = (storageKey, initialData = []) => {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : initialData;
  });

  const [loading, setLoading] = useState(false);

  // Salvar no localStorage sempre que data mudar
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(data));
  }, [data, storageKey]);

  const create = useCallback(async (item) => {
    setLoading(true);
    const newItem = {
      id: Date.now() + Math.random(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...item
    };
    setData(prev => [...prev, newItem]);
    setLoading(false);
    return newItem;
  }, []);

  const update = useCallback(async (id, updates) => {
    setLoading(true);
    setData(prev => prev.map(item => 
      item.id === id 
        ? { ...item, ...updates, updatedAt: new Date().toISOString() }
        : item
    ));
    setLoading(false);
  }, []);

  const remove = useCallback(async (id) => {
    setLoading(true);
    setData(prev => prev.filter(item => item.id !== id));
    setLoading(false);
  }, []);

  const bulkUpdate = useCallback(async (updates) => {
    setLoading(true);
    setData(prev => prev.map(item => {
      const update = updates.find(u => u.id === item.id);
      return update ? { ...item, ...update, updatedAt: new Date().toISOString() } : item;
    }));
    setLoading(false);
  }, []);

  return { data, loading, create, update, remove, bulkUpdate, setData };
};

// Hook para exportação de dados
const useDataExport = () => {
  const exportToJSON = useCallback((data, filename) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const exportToCSV = useCallback((data, filename) => {
    if (!data.length) return;
    
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(item => 
      Object.values(item).map(value => 
        typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
      ).join(',')
    );
    
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const importFromJSON = useCallback((file, callback) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        callback(data);
      } catch (error) {
        alert('Erro ao importar arquivo JSON');
      }
    };
    reader.readAsText(file);
  }, []);

  return { exportToJSON, exportToCSV, importFromJSON };
};

// Componente para formulário de vitórias diárias
const DailyWinForm = ({ onSubmit, initialData = null, onCancel }) => {
  const [formData, setFormData] = useState({
    text: initialData?.text || '',
    category: initialData?.category || 'Grow Mindset',
    completed: initialData?.completed || false,
    notes: initialData?.notes || ''
  });

  const categories = ['Grow Mindset', 'Money', 'Criatividade', 'Estudos', 'In Shape', 'Espiritual'];

  const handleSubmit = () => {
    if (!formData.text.trim()) return;
    onSubmit(formData);
    if (!initialData) {
      setFormData({ text: '', category: 'Grow Mindset', completed: false, notes: '' });
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Vitória
        </label>
        <input
          type="text"
          value={formData.text}
          onChange={(e) => setFormData(prev => ({ ...prev, text: e.target.value }))}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ex: Estudei 2h de React"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Categoria
        </label>
        <select
          value={formData.category}
          onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.completed}
            onChange={(e) => setFormData(prev => ({ ...prev, completed: e.target.checked }))}
            className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
          />
          <span className="text-sm text-gray-300">Concluída</span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Notas
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="3"
          placeholder="Detalhes sobre a vitória..."
        />
      </div>

      <div className="flex space-x-2">
        <button
          onClick={handleSubmit}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors flex items-center justify-center space-x-2"
        >
          <Save size={16} />
          <span>{initialData ? 'Atualizar' : 'Adicionar'}</span>
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors"
          >
            Cancelar
          </button>
        )}
      </div>
    </div>
  );
};

// Componente para item de vitória
const DailyWinItem = ({ win, onUpdate, onDelete, onEdit }) => {
  const toggleCompleted = () => {
    onUpdate(win.id, { completed: !win.completed });
  };

  return (
    <div className={`bg-gray-800 p-4 rounded-lg border-l-4 ${
      win.completed ? 'border-green-500 bg-opacity-50' : 'border-blue-500'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <button
            onClick={toggleCompleted}
            className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
              win.completed 
                ? 'bg-green-500 border-green-500 text-white' 
                : 'border-gray-400 hover:border-green-500'
            }`}
          >
            {win.completed && <span className="text-xs">✓</span>}
          </button>
          
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <span className={`font-medium ${win.completed ? 'line-through text-gray-400' : 'text-white'}`}>
                {win.text}
              </span>
              <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                {win.category}
              </span>
            </div>
            
            {win.notes && (
              <p className="text-sm text-gray-400 mt-1">{win.notes}</p>
            )}
            
            <div className="text-xs text-gray-500 mt-2">
              Criado: {new Date(win.createdAt).toLocaleDateString('pt-BR')}
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(win)}
            className="p-1 text-gray-400 hover:text-blue-400 transition-colors"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDelete(win.id)}
            className="p-1 text-gray-400 hover:text-red-400 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente principal
const ProductivityCRUD = () => {
  const { data: dailyWins, loading, create, update, remove } = useCrud('dailyWins', [
    { id: 1, text: 'Grow Mindset', category: 'Grow Mindset', completed: false, notes: '' },
    { id: 2, text: 'Money', category: 'Money', completed: false, notes: '' },
    { id: 3, text: 'Criatividade', category: 'Criatividade', completed: false, notes: '' }
  ]);

  const { exportToJSON, exportToCSV, importFromJSON } = useDataExport();
  const [showForm, setShowForm] = useState(false);
  const [editingWin, setEditingWin] = useState(null);
  const [filter, setFilter] = useState('all');

  // Sistema de XP e Level
  const XP_PER_WIN = 20;
  const LEVEL_THRESHOLDS = [0, 100, 200, 300, 400];
  const LEVEL_NAMES = ['Iniciante', 'Aprendiz', 'Mestre', 'Grão-Mestre', 'JEDI'];

  const calculateXpAndLevel = useCallback((wins) => {
    const completedWins = wins.filter(w => w.completed);
    const currentXp = completedWins.length * XP_PER_WIN;
    let currentLevel = 0;
    
    for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
      if (currentXp >= LEVEL_THRESHOLDS[i]) {
        currentLevel = i;
      } else {
        break;
      }
    }
    
    const xpToNextLevel = currentLevel < LEVEL_NAMES.length - 1 
      ? LEVEL_THRESHOLDS[currentLevel + 1] 
      : currentXp;

    return { currentXp, currentLevel, xpToNextLevel };
  }, []);

  const { currentXp, currentLevel, xpToNextLevel } = calculateXpAndLevel(dailyWins);

  const handleAddWin = async (winData) => {
    await create(winData);
    setShowForm(false);
  };

  const handleUpdateWin = async (winData) => {
    await update(editingWin.id, winData);
    setEditingWin(null);
  };

  const handleEditWin = (win) => {
    setEditingWin(win);
    setShowForm(false);
  };

  const handleDeleteWin = async (id) => {
    if (confirm('Tem certeza que deseja excluir esta vitória?')) {
      await remove(id);
    }
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (file) {
      importFromJSON(file, (data) => {
        if (Array.isArray(data)) {
          localStorage.setItem('dailyWins', JSON.stringify(data));
          window.location.reload();
        }
      });
    }
  };

  // Filtrar vitórias
  const filteredWins = dailyWins.filter(win => {
    if (filter === 'completed') return win.completed;
    if (filter === 'pending') return !win.completed;
    return true;
  });

  const completedToday = dailyWins.filter(w => w.completed).length;
  const totalWins = dailyWins.length;
  const progressPercentage = totalWins > 0 ? (completedToday / totalWins) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold flex items-center space-x-3">
              <Trophy className="text-yellow-500" />
              <span>Sistema de Vitórias Diárias</span>
            </h1>
            
            <div className="flex space-x-2">
              <button
                onClick={() => exportToJSON(dailyWins, 'daily-wins')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors"
              >
                <Download size={16} />
                <span>JSON</span>
              </button>
              
              <button
                onClick={() => exportToCSV(dailyWins, 'daily-wins')}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors"
              >
                <Download size={16} />
                <span>CSV</span>
              </button>
              
              <label className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors cursor-pointer">
                <Upload size={16} />
                <span>Importar</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-700 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-400">{completedToday}</div>
              <div className="text-sm text-gray-300">Concluídas</div>
            </div>
            
            <div className="bg-gray-700 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-yellow-400">{currentXp}</div>
              <div className="text-sm text-gray-300">XP Total</div>
            </div>
            
            <div className="bg-gray-700 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-400">{LEVEL_NAMES[currentLevel]}</div>
              <div className="text-sm text-gray-300">Nível Atual</div>
            </div>
            
            <div className="bg-gray-700 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-400">{progressPercentage.toFixed(0)}%</div>
              <div className="text-sm text-gray-300">Progresso Diário</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${(currentXp / xpToNextLevel) * 100}%` }}
            ></div>
          </div>
          <div className="text-center text-sm text-gray-400">
            {currentXp} / {xpToNextLevel} XP para o próximo nível
          </div>
        </div>

        {/* Controls */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <div className="flex flex-wrap items-center space-x-4 mb-4">
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center space-x-2 transition-colors"
            >
              <Plus size={16} />
              <span>Nova Vitória</span>
            </button>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Todas ({dailyWins.length})</option>
              <option value="completed">Concluídas ({dailyWins.filter(w => w.completed).length})</option>
              <option value="pending">Pendentes ({dailyWins.filter(w => !w.completed).length})</option>
            </select>
          </div>

          {/* Form */}
          {showForm && (
            <DailyWinForm
              onSubmit={handleAddWin}
              onCancel={() => setShowForm(false)}
            />
          )}

          {/* Edit Form */}
          {editingWin && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Editando Vitória</h3>
              <DailyWinForm
                initialData={editingWin}
                onSubmit={handleUpdateWin}
                onCancel={() => setEditingWin(null)}
              />
            </div>
          )}
        </div>

        {/* Wins List */}
        <div className="space-y-4">
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-gray-400">Carregando...</p>
            </div>
          )}

          {!loading && filteredWins.length === 0 && (
            <div className="text-center py-8 bg-gray-800 rounded-lg">
              <Lightbulb className="mx-auto mb-4 text-gray-400" size={48} />
              <p className="text-gray-400">Nenhuma vitória encontrada.</p>
              <p className="text-sm text-gray-500 mt-2">
                {filter === 'all' ? 'Adicione sua primeira vitória!' : 'Tente alterar o filtro.'}
              </p>
            </div>
          )}

          {filteredWins.map((win) => (
            <DailyWinItem
              key={win.id}
              win={win}
              onUpdate={update}
              onDelete={handleDeleteWin}
              onEdit={handleEditWin}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductivityCRUD;