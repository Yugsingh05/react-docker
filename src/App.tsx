import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Check, X, Search } from 'lucide-react';

// Type definitions
interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: string;
}

type FilterType = 'all' | 'active' | 'completed';

interface TodoStats {
  total: number;
  active: number;
  completed: number;
}

const TodoApp: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<string>('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState<string>('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Add a new todo
  const addTodo = (): void => {
    if (newTodo.trim() === '') return;
    
    const todo: Todo = {
      id: Date.now(),
      text: newTodo.trim(),
      completed: false,
      createdAt: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };
    
    setTodos(prev => [...prev, todo]);
    setNewTodo('');
  };

  // Delete a todo
  const deleteTodo = (id: number): void => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  // Toggle todo completion
  const toggleTodo = (id: number): void => {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  // Start editing a todo
  const startEdit = (id: number, text: string): void => {
    setEditingId(id);
    setEditText(text);
  };

  // Save edited todo
  const saveEdit = (): void => {
    if (editText.trim() === '') return;
    
    setTodos(prev => prev.map(todo =>
      todo.id === editingId ? { ...todo, text: editText.trim() } : todo
    ));
    setEditingId(null);
    setEditText('');
  };

  // Cancel editing
  const cancelEdit = (): void => {
    setEditingId(null);
    setEditText('');
  };

  // Clear all completed todos
  const clearCompleted = (): void => {
    setTodos(prev => prev.filter(todo => !todo.completed));
  };

  // Handle keyboard events
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>, action: 'add' | 'save'): void => {
    if (event.key === 'Enter') {
      if (action === 'add') {
        addTodo();
      } else if (action === 'save') {
        saveEdit();
      }
    }
  };

  // Filter todos based on status and search term
  const filteredTodos: Todo[] = todos.filter(todo => {
    const matchesFilter: boolean = 
      filter === 'all' || 
      (filter === 'active' && !todo.completed) || 
      (filter === 'completed' && todo.completed);
    
    const matchesSearch: boolean = todo.text.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  // Get counts for different filters
  const todoStats: TodoStats = {
    total: todos.length,
    active: todos.filter(todo => !todo.completed).length,
    completed: todos.filter(todo => todo.completed).length
  };

  // Filter options for rendering
  const filterOptions: FilterType[] = ['all', 'active', 'completed'];

  // Get empty state message
  const getEmptyStateMessage = (): { title: string; subtitle?: string } => {
    if (searchTerm) {
      return { title: 'No tasks match your search' };
    }
    
    switch (filter) {
      case 'active':
        return { title: 'All caught up!' };
      case 'completed':
        return { title: 'No completed tasks yet' };
      default:
        return { 
          title: 'Your task list is empty',
          subtitle: 'Add a task above to get started'
        };
    }
  };

  const emptyState = getEmptyStateMessage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full mb-6 shadow-lg">
            <Check size={32} className="text-white" />
          </div>
          <h1 className="text-4xl font-serif font-bold text-slate-800 mb-3 tracking-tight">
            My Tasks
          </h1>
          <p className="text-lg text-slate-600 font-light">
            Enjoy task management for the discerning professional
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          {/* Add Todo Section */}
          <div className="p-8 border-b border-slate-200/60 bg-gradient-to-r from-white to-slate-50/50">
            <div className="relative">
              <input
                type="text"
                value={newTodo}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewTodo(e.target.value)}
                onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => handleKeyPress(e, 'add')}
                placeholder="What would you like to accomplish today?"
                className="w-full px-6 py-4 pr-16 text-lg border-2 border-slate-200 rounded-xl focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 focus:outline-none transition-all duration-200 bg-white/70 placeholder-slate-400"
              />
              <button
                onClick={addTodo}
                className="absolute right-2 top-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 transition-all duration-200 shadow-md hover:shadow-lg"
                aria-label="Add new task"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>

          {/* Controls Section */}
          <div className="p-6 bg-slate-50/50 border-b border-slate-200/60">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search size={20} className="absolute left-4 top-3.5 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                  placeholder="Search tasks..."
                  className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-lg focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all bg-white/70"
                />
              </div>

              {/* Filter Buttons */}
              <div className="flex bg-white rounded-xl p-1 shadow-sm border border-slate-200/60">
                {filterOptions.map((filterType: FilterType) => (
                  <button
                    key={filterType}
                    onClick={() => setFilter(filterType)}
                    className={`px-6 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                      filter === filterType
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                        : 'text-slate-600 hover:text-indigo-600 hover:bg-slate-50'
                    }`}
                  >
                    {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Statistics */}
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-200/60">
              <div className="flex gap-8 text-sm">
                <span className="text-slate-600">
                  <span className="font-semibold text-slate-800">{todoStats.total}</span> Total
                </span>
                <span className="text-slate-600">
                  <span className="font-semibold text-amber-600">{todoStats.active}</span> Active
                </span>
                <span className="text-slate-600">
                  <span className="font-semibold text-emerald-600">{todoStats.completed}</span> Completed
                </span>
              </div>
              {todoStats.completed > 0 && (
                <button
                  onClick={clearCompleted}
                  className="text-sm text-slate-500 hover:text-red-600 font-medium transition-colors duration-200 border-l border-slate-200 pl-6"
                >
                  Clear Completed
                </button>
              )}
            </div>
          </div>

          {/* Todo List */}
          <div className="p-6">
            {filteredTodos.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check size={32} className="text-slate-400" />
                </div>
                <p className="text-xl font-light text-slate-500 mb-2">
                  {emptyState.title}
                </p>
                {emptyState.subtitle && (
                  <p className="text-slate-400">
                    {emptyState.subtitle}
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTodos.map((todo: Todo) => (
                  <div
                    key={todo.id}
                    className={`group relative bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-xl p-5 transition-all duration-200 hover:shadow-md hover:bg-white/80 ${
                      todo.completed ? 'opacity-75' : ''
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Complete Toggle */}
                      <button
                        onClick={() => toggleTodo(todo.id)}
                        className={`flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-200 mt-0.5 ${
                          todo.completed
                            ? 'bg-emerald-500 border-emerald-500 text-white shadow-md'
                            : 'border-slate-300 hover:border-emerald-400 hover:bg-emerald-50'
                        }`}
                        aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
                      >
                        {todo.completed && <Check size={16} />}
                      </button>

                      {/* Todo Content */}
                      <div className="flex-1 min-w-0">
                        {editingId === todo.id ? (
                          <div className="flex gap-3">
                            <input
                              type="text"
                              value={editText}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditText(e.target.value)}
                              onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => handleKeyPress(e, 'save')}
                              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:outline-none bg-white"
                              autoFocus
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={saveEdit}
                                className="text-emerald-600 hover:text-emerald-700 p-1 rounded transition-colors"
                                aria-label="Save changes"
                              >
                                <Check size={18} />
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="text-slate-400 hover:text-slate-600 p-1 rounded transition-colors"
                                aria-label="Cancel editing"
                              >
                                <X size={18} />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <p className={`text-lg leading-relaxed ${
                              todo.completed 
                                ? 'line-through text-slate-400' 
                                : 'text-slate-700'
                            }`}>
                              {todo.text}
                            </p>
                            <p className="text-sm text-slate-400 mt-2 font-light">
                              {todo.createdAt}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      {editingId !== todo.id && (
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                          <button
                            onClick={() => startEdit(todo.id, todo.text)}
                            className="text-slate-400 hover:text-indigo-600 p-2 rounded-lg hover:bg-indigo-50 transition-all duration-200"
                            aria-label="Edit task"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => deleteTodo(todo.id)}
                            className="text-slate-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-all duration-200"
                            aria-label="Delete task"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-slate-500 font-light">
            Crafted with attention to detail • Built with React & TypeScript
          </p>
        </div>
      </div>
    </div>
  );
};

export default TodoApp;