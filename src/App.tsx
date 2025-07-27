import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Check, X, Search } from "lucide-react";
import { createTodo, deleteTodo, getTodos, updateTodo } from "./lib/services/todo.services";
// Type definitions
interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  user_id: number;
}

type FilterType = "all" | "active" | "completed";

interface TodoStats {
  total: number;
  active: number;
  completed: number;
}

const TodoApp: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTitle, setNewTitle] = useState<string>("");
  const [newDescription, setNewDescription] = useState<string>("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState<string>("");
  const [editDescription, setEditDescription] = useState<string>("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  // Load todos on component mount
  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async (): Promise<void> => {
    try {
      setLoading(true);
      const data = await getTodos();
      // Filter todos for user_id = 2
      const userTodos = data.data.filter((todo: Todo) => todo.user_id === 2);
      setTodos(userTodos);
    } catch (error) {
      console.error("Error loading todos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Add a new todo
  const addTodo = async (): Promise<void> => {
    if (newTitle.trim() === "" || newDescription.trim() === "") return;

    try {
      const newTodo = await createTodo({
        title: newTitle.trim(),
        description: newDescription.trim(),
        completed: false,
        user_id: 2,
      });

      setTodos((prev) => [...prev, newTodo.data]);
      setNewTitle("");
      setNewDescription("");
    } catch (error) {
      console.error("Error creating todo:", error);
    }
  };

  const DeleteTodo = async (id: number): Promise<void> => {
    try {
      await deleteTodo(id);
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const toggleTodo = async (id: number): Promise<void> => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    try {
      const updatedTodo = await updateTodo(id, {
        title: todo.title,
        description: todo.description,
        completed: !todo.completed,
      });

      setTodos((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, completed: updatedTodo.data.completed } : t
        )
      );
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const startEdit = (id: number): void => {
    const todo = todos.find((t) => t.id === id);
    if (todo) {
      setEditingId(id);
      setEditTitle(todo.title);
      setEditDescription(todo.description);
    }
  };

  const saveEdit = async (): Promise<void> => {
    if (editTitle.trim() === "" || editDescription.trim() === "" || !editingId)
      return;

    try {
      const todo = todos.find((t) => t.id === editingId);
      if (!todo) return;

      const updatedTodo = await updateTodo(editingId, {
        title: editTitle.trim(),
        description: editDescription.trim(),
        completed: todo.completed,
      });

      setTodos((prev) =>
        prev.map((t) =>
          t.id === editingId
            ? {
                ...t,
                title: updatedTodo.data.title,
                description: updatedTodo.data.description,
              }
            : t
        )
      );

      setEditingId(null);
      setEditTitle("");
      setEditDescription("");
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const cancelEdit = (): void => {
    setEditingId(null);
    setEditTitle("");
    setEditDescription("");
  };

  const clearCompleted = async (): Promise<void> => {
    const completedTodos = todos.filter((todo) => todo.completed);

    try {
      await Promise.all(
        completedTodos.map((todo) => deleteTodo(todo.id))
      );
      setTodos((prev) => prev.filter((todo) => !todo.completed));
    } catch (error) {
      console.error("Error clearing completed todos:", error);
    }
  };

  const handleKeyPress = (
    event: React.KeyboardEvent<HTMLInputElement>,
    action: "add" | "save"
  ): void => {
    if (event.key === "Enter") {
      if (action === "add") {
        addTodo();
      } else if (action === "save") {
        saveEdit();
      }
    }
  };

  const filteredTodos: Todo[] = todos.filter((todo) => {
    const matchesFilter: boolean =
      filter === "all" ||
      (filter === "active" && !todo.completed) ||
      (filter === "completed" && todo.completed);

    const searchText = `${todo.title} ${todo.description}`.toLowerCase();
    const matchesSearch: boolean = searchText.includes(
      searchTerm.toLowerCase()
    );

    return matchesFilter && matchesSearch;
  });

  const todoStats: TodoStats = {
    total: todos.length,
    active: todos.filter((todo) => !todo.completed).length,
    completed: todos.filter((todo) => todo.completed).length,
  };

  const filterOptions: FilterType[] = ["all", "active", "completed"];

  const getEmptyStateMessage = (): { title: string; subtitle?: string } => {
    if (searchTerm) return { title: "No tasks match your search" };

    switch (filter) {
      case "active":
        return { title: "All caught up!" };
      case "completed":
        return { title: "No completed tasks yet" };
      default:
        return {
          title: "Your task list is empty",
          subtitle: "Add a task above to get started",
        };
    }
  };

  const emptyState = getEmptyStateMessage();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
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
          {/* Add Todo Inputs */}
          <div className="p-8 border-b border-slate-200/60 bg-gradient-to-r from-white to-slate-50/50 space-y-4">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Task title"
              className="w-full px-6 py-4 text-lg border-2 border-slate-200 rounded-xl focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 focus:outline-none bg-white/70 placeholder-slate-400"
            />
            <div className="relative">
              <input
                type="text"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, "add")}
                placeholder="Task description"
                className="w-full px-6 py-4 pr-16 text-lg border-2 border-slate-200 rounded-xl focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 focus:outline-none bg-white/70 placeholder-slate-400"
              />
              <button
                onClick={addTodo}
                disabled={!newTitle.trim() || !newDescription.trim()}
                className="absolute right-2 top-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Add new task"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>

          {/* Controls */}
          <div className="p-6 bg-slate-50/50 border-b border-slate-200/60">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search
                  size={20}
                  className="absolute left-4 top-3.5 text-slate-400"
                />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search tasks..."
                  className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-lg focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition-all bg-white/70"
                />
              </div>

              <div className="flex bg-white rounded-xl p-1 shadow-sm border border-slate-200/60">
                {filterOptions.map((filterType: FilterType) => (
                  <button
                    key={filterType}
                    onClick={() => setFilter(filterType)}
                    className={`px-6 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                      filter === filterType
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                        : "text-slate-600 hover:text-indigo-600 hover:bg-slate-50"
                    }`}
                  >
                    {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-200/60">
              <div className="flex gap-8 text-sm">
                <span className="text-slate-600">
                  <span className="font-semibold text-slate-800">
                    {todoStats.total}
                  </span>{" "}
                  Total
                </span>
                <span className="text-slate-600">
                  <span className="font-semibold text-amber-600">
                    {todoStats.active}
                  </span>{" "}
                  Active
                </span>
                <span className="text-slate-600">
                  <span className="font-semibold text-emerald-600">
                    {todoStats.completed}
                  </span>{" "}
                  Completed
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
                  <p className="text-slate-400">{emptyState.subtitle}</p>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTodos.map((todo: Todo) => (
                  <div
                    key={todo.id}
                    className={`group relative bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-xl p-5 transition-all duration-200 hover:shadow-md hover:bg-white/80 ${
                      todo.completed ? "opacity-75" : ""
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <button
                        onClick={() => toggleTodo(todo.id)}
                        className={`flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-200 mt-0.5 ${
                          todo.completed
                            ? "bg-emerald-500 border-emerald-500 text-white shadow-md"
                            : "border-slate-300 hover:border-emerald-400 hover:bg-emerald-50"
                        }`}
                        aria-label={
                          todo.completed
                            ? "Mark as incomplete"
                            : "Mark as complete"
                        }
                      >
                        {todo.completed && <Check size={16} />}
                      </button>

                      <div className="flex-1 min-w-0">
                        {editingId === todo.id ? (
                          <div className="space-y-3">
                            <input
                              type="text"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              placeholder="Task title"
                              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:outline-none bg-white"
                              autoFocus
                            />
                            <input
                              type="text"
                              value={editDescription}
                              onChange={(e) =>
                                setEditDescription(e.target.value)
                              }
                              onKeyPress={(e) => handleKeyPress(e, "save")}
                              placeholder="Task description"
                              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 focus:outline-none bg-white"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={saveEdit}
                                disabled={
                                  !editTitle.trim() || !editDescription.trim()
                                }
                                className="text-emerald-600 hover:text-emerald-700 p-1 rounded transition-colors disabled:opacity-50"
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
                            <h3
                              className={`text-lg font-medium leading-relaxed ${
                                todo.completed
                                  ? "line-through text-slate-400"
                                  : "text-slate-800"
                              }`}
                            >
                              {todo.title}
                            </h3>
                            <p
                              className={`text-base leading-relaxed mt-1 ${
                                todo.completed
                                  ? "line-through text-slate-400"
                                  : "text-slate-600"
                              }`}
                            >
                              {todo.description}
                            </p>
                            <p className="text-sm text-slate-400 mt-2 font-light">
                              {new Date(todo.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </p>
                          </div>
                        )}
                      </div>

                      {editingId !== todo.id && (
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
                          <button
                            onClick={() => startEdit(todo.id)}
                            className="text-slate-400 hover:text-indigo-600 p-2 rounded-lg hover:bg-indigo-50 transition-all duration-200"
                            aria-label="Edit task"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => DeleteTodo(todo.id)}
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
