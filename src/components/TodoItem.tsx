/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */

import React, { FormEvent, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { useTodos } from '../context/TodosContext';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const { deleteTodo, toggleTodo, updateTodo } = useTodos();

  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);

  const saveChanges = () => {
    updateTodo(todo.id, newTitle);
    setIsEditing(false);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    saveChanges();
  };

  const handleCancel = () => {
    setNewTitle(todo.title);
    setIsEditing(false);
  };

  const handleDelete = () => {
    deleteTodo(todo.id);

    requestAnimationFrame(() => {
      const newTodoField = document.querySelector<HTMLInputElement>(
        '[data-cy="NewTodoField"]',
      );

      newTodoField?.focus();
    });
  };

  return (
    <div
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={() => toggleTodo(todo.id)}
        />
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={newTitle}
            autoFocus
            onChange={event => setNewTitle(event.target.value)}
            onBlur={saveChanges}
            onKeyUp={event => {
              if (event.key === 'Escape') {
                handleCancel();
              }
            }}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setNewTitle(todo.title);
              setIsEditing(true);
            }}
          >
            {todo.title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleDelete}
          >
            &times;
          </button>
        </>
      )}
    </div>
  );
};
