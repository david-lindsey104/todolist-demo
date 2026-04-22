import { useState } from 'react'

const PRIORITIES = ['low', 'normal', 'high']

const priorityConfig = {
  low:    { label: 'Low',    color: 'bg-slate-200 text-slate-500',   dot: 'bg-slate-400' },
  normal: { label: 'Normal', color: 'bg-blue-100 text-blue-600',     dot: 'bg-blue-400'  },
  high:   { label: 'High',   color: 'bg-red-100 text-red-600',       dot: 'bg-red-500'   },
}

function PriorityBadge({ priority }) {
  const cfg = priorityConfig[priority]
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  )
}

function PrioritySelect({ value, onChange, className = '' }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Priority"
      className={`text-xs border border-slate-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white ${className}`}
    >
      {PRIORITIES.map((p) => (
        <option key={p} value={p}>{priorityConfig[p].label}</option>
      ))}
    </select>
  )
}

export default function App() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Read a book',      done: false, priority: 'normal' },
    { id: 2, text: 'Go for a walk',    done: true,  priority: 'low'    },
    { id: 3, text: 'Write some code',  done: false, priority: 'high'   },
  ])
  const [input, setInput] = useState('')
  const [newPriority, setNewPriority] = useState('normal')
  const [filter, setFilter] = useState('all')

  const addTodo = () => {
    const text = input.trim()
    if (!text) return
    setTodos([...todos, { id: Date.now(), text, done: false, priority: newPriority }])
    setInput('')
    setNewPriority('normal')
  }

  const toggleTodo = (id) =>
    setTodos(todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))

  const deleteTodo = (id) => setTodos(todos.filter((t) => t.id !== id))

  const setPriority = (id, priority) =>
    setTodos(todos.map((t) => (t.id === id ? { ...t, priority } : t)))

  const visible = todos.filter((t) =>
    filter === 'active' ? !t.done : filter === 'completed' ? t.done : true,
  )

  const remaining = todos.filter((t) => !t.done).length

  const tabClass = (name) =>
    `px-3 py-1 rounded-md text-sm font-medium transition ${
      filter === name
        ? 'bg-indigo-600 text-white'
        : 'text-slate-600 hover:bg-slate-200'
    }`

  return (
    <div className="min-h-screen bg-slate-100 flex items-start justify-center py-16 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">Todo List</h1>

        {/* Add todo row */}
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTodo()}
            placeholder="What needs doing?"
            className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={addTodo}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition"
          >
            Add
          </button>
        </div>

        {/* Priority selector for new todo */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs text-slate-500">Priority:</span>
          <PrioritySelect value={newPriority} onChange={setNewPriority} />
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-4">
          <button onClick={() => setFilter('all')} className={tabClass('all')}>
            All
          </button>
          <button onClick={() => setFilter('active')} className={tabClass('active')}>
            Active
          </button>
          <button onClick={() => setFilter('completed')} className={tabClass('completed')}>
            Completed
          </button>
        </div>

        {/* Todo list */}
        <ul className="space-y-2">
          {visible.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center gap-3 px-3 py-2 rounded-md border border-slate-200 hover:bg-slate-50"
            >
              {/* Toggle */}
              <button
                onClick={() => toggleTodo(todo.id)}
                aria-label={todo.done ? 'Mark incomplete' : 'Mark complete'}
                className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition ${
                  todo.done
                    ? 'bg-indigo-600 border-indigo-600'
                    : 'border-slate-300 hover:border-indigo-400'
                }`}
              >
                {todo.done && (
                  <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>

              {/* Text */}
              <span
                className={`flex-1 text-left text-sm ${
                  todo.done ? 'line-through text-slate-400' : 'text-slate-800'
                }`}
              >
                {todo.text}
              </span>

              {/* Priority badge + inline changer */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <PriorityBadge priority={todo.priority} />
                <PrioritySelect
                  value={todo.priority}
                  onChange={(p) => setPriority(todo.id, p)}
                  className="opacity-0 hover:opacity-100 focus:opacity-100 w-20 transition-opacity"
                />
              </div>

              {/* Delete */}
              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-slate-400 hover:text-red-500 text-lg font-bold px-1 flex-shrink-0"
                aria-label="Delete todo"
              >
                ×
              </button>
            </li>
          ))}
          {visible.length === 0 && (
            <li className="text-center text-slate-400 py-4 text-sm">
              Nothing here.
            </li>
          )}
        </ul>

        <div className="mt-4 text-sm text-slate-500">
          {remaining} {remaining === 1 ? 'item' : 'items'} left
        </div>
      </div>
    </div>
  )
}