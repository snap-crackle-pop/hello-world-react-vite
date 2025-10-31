import { useMemo, useState } from 'react';

type Todo = {
  id: string;
  text: string;
  completed: boolean;
};

export default function App() {
  const [newTodoText, setNewTodoText] = useState<string>('');
  const [todos, setTodos] = useState<Todo[]>([]);

  const remainingCount = useMemo(() => {
    return todos.filter((todo) => !todo.completed).length;
  }, [todos]);

  function generateId(): string {
    // Prefer crypto.randomUUID when available; fallback keeps uniqueness adequate for UI lists
    if ('randomUUID' in crypto && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }

  function addTodo() {
    const text = newTodoText.trim();
    if (text.length === 0) return;
    setTodos((prev) => [{ id: generateId(), text, completed: false }, ...prev]);
    setNewTodoText('');
  }

  function toggleTodo(todoId: string) {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }

  function deleteTodo(todoId: string) {
    setTodos((prev) => prev.filter((todo) => todo.id !== todoId));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    addTodo();
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault();
      addTodo();
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex justify-center p-6">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-4">Todo List</h1>

        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a new task..."
            aria-label="Add a new task"
            className="flex-1 rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-4 py-2 text-white font-medium shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Add
          </button>
        </form>

        <div className="mt-3 text-sm text-slate-600">
          {todos.length === 0 ? 'No tasks yet' : `${remainingCount} left`}
        </div>

        <ul className="mt-4 space-y-2">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="group flex items-center justify-between rounded-md bg-white px-3 py-2 shadow-sm border border-slate-200"
            >
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  aria-label={`Mark ${todo.text} as ${todo.completed ? 'incomplete' : 'complete'}`}
                />
                <span className={todo.completed ? 'line-through text-slate-400' : ''}>
                  {todo.text}
                </span>
              </label>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-sm text-red-600 hover:text-red-700 focus:outline-none"
                aria-label={`Delete ${todo.text}`}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
