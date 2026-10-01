import React, { createContext, useContext, useEffect, useState } from 'react';
import { Todo } from '../types/Todo';

type TodosContextType = {
  todos: Todo[];
  addTodo: (title: string) => void;
  deleteTodo: (todoId: number) => void;
  toggleTodo: (todoId: number) => void;
  toggleAll: () => void;
  clearCompleted: () => void;
  updateTodo: (todoId: number, title: string) => void;
};

const TodosContext = createContext<TodosContextType | undefined>(undefined);

const getInitialTodos = (): Todo[] => {
  const savedTodos = localStorage.getItem('todos');

  return savedTodos ? JSON.parse(savedTodos) : [];
};

export const TodosProvider = ({ children }: { children: React.ReactNode }) => {
  const [todos, setTodos] = useState<Todo[]>(getInitialTodos);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (title: string) => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      return;
    }

    const newTodo: Todo = {
      id: +new Date(),
      title: trimmedTitle,
      completed: false,
    };

    setTodos(currentTodos => [...currentTodos, newTodo]);
  };

  const deleteTodo = (todoId: number) => {
    setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
  };

  const toggleTodo = (todoId: number) => {
    setTodos(currentTodos =>
      currentTodos.map(todo =>
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  const toggleAll = () => {
    setTodos(currentTodos => {
      const areAllCompleted = currentTodos.every(todo => todo.completed);

      return currentTodos.map(todo => ({
        ...todo,
        completed: !areAllCompleted,
      }));
    });
  };

  const clearCompleted = () => {
    setTodos(currentTodos => currentTodos.filter(todo => !todo.completed));
  };

  const updateTodo = (todoId: number, title: string) => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      deleteTodo(todoId);

      return;
    }

    setTodos(currentTodos =>
      currentTodos.map(todo =>
        todo.id === todoId ? { ...todo, title: trimmedTitle } : todo,
      ),
    );
  };

  return (
    <TodosContext.Provider
      value={{
        todos,
        addTodo,
        deleteTodo,
        toggleTodo,
        toggleAll,
        clearCompleted,
        updateTodo,
      }}
    >
      {children}
    </TodosContext.Provider>
  );
};

export const useTodos = () => {
  const context = useContext(TodosContext);

  if (!context) {
    throw new Error('useTodos must be used within TodosProvider');
  }

  return context;
};
