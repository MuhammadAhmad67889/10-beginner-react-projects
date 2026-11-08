import { useEffect, useRef, useState } from 'react'
import { fadeSwap } from '../lib/animations'

const STORAGE_KEY = 'todos'

// Read the saved list once, when the component first mounts.
// A broken saved value falls back to an empty list instead of
// crashing the page.
function loadTodos() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    return Array.isArray(saved) ? saved : []
  } catch {
    return []
  }
}

export default function TodoList() {
  const [todos, setTodos] = useState(loadTodos)
  const [text, setText] = useState('')
  const [filter, setFilter] = useState('all')
  const listRef = useRef(null)
  const lastAddedId = useRef(null)

  // Saved on every change so a refresh keeps the list.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  // A new item fades in. The id of the newest item is kept in a
  // ref so this only runs for items the user just added.
  useEffect(() => {
    if (!lastAddedId.current || !listRef.current) return
    const item = listRef.current.querySelector(
      `[data-id="${lastAddedId.current}"]`
    )
    if (item) fadeSwap(item)
    lastAddedId.current = null
  }, [todos])

  function addTodo(event) {
    event.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    const todo = { id: Date.now(), text: trimmed, done: false }
    lastAddedId.current = todo.id
    setTodos([...todos, todo])
    setText('')
  }

  function toggleTodo(id) {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, done: !todo.done } : todo
      )
    )
  }

  function deleteTodo(id) {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const visibleTodos =
    filter === 'active'
      ? todos.filter((todo) => !todo.done)
      : filter === 'done'
        ? todos.filter((todo) => todo.done)
        : todos

  return (
    <div>
      <form className="todo-form" onSubmit={addTodo}>
        <input
          type="text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="What needs doing?"
          aria-label="New task"
        />
        <button className="primary" type="submit">
          Add
        </button>
      </form>

      <div className="row filters" style={{ marginTop: '1rem' }}>
        {['all', 'active', 'done'].map((name) => (
          <button
            key={name}
            className={filter === name ? 'active' : ''}
            onClick={() => setFilter(name)}
          >
            {name[0].toUpperCase() + name.slice(1)}
          </button>
        ))}
      </div>

      <ul className="todo-list" ref={listRef}>
        {visibleTodos.map((todo) => (
          <li key={todo.id} data-id={todo.id} className={todo.done ? 'done' : ''}>
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => toggleTodo(todo.id)}
              aria-label={`Mark "${todo.text}" as ${todo.done ? 'not done' : 'done'}`}
            />
            <span>{todo.text}</span>
            <button
              className="delete"
              onClick={() => deleteTodo(todo.id)}
              aria-label={`Delete "${todo.text}"`}
            >
              &times;
            </button>
          </li>
        ))}
      </ul>

      {visibleTodos.length === 0 && (
        <p className="empty-message">
          {todos.length === 0
            ? 'Nothing here yet — add your first task above.'
            : 'No tasks match this filter.'}
        </p>
      )}
    </div>
  )
}
