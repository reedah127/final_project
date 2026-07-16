import React, { useState, useEffect } from 'react';

export default function TaskForm({ API_URL, token, taskToEdit, clearEdit, onTaskSaved, triggerAlert }) {
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState('Pending');

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setStatus(taskToEdit.status);
    } else {
      setTitle('');
      setStatus('Pending');
    }
  }, [taskToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = taskToEdit ? `${API_URL}/tasks/${taskToEdit._origin_id || taskToEdit._id}` : `${API_URL}/tasks`;
    const method = taskToEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, status })
      });
      if (!res.ok) throw new Error('Could not process task operation');
      
      triggerAlert(taskToEdit ? 'Task updated!' : 'Task created!', 'success');
      clearEdit();
      onTaskSaved();
    } catch (err) {
      triggerAlert(err.message, 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <input type="text" placeholder="What needs to be done?" value={title} onChange={e => setTitle(e.target.value)} required />
      
      {taskToEdit && (
        <select value={status} onChange={e => setStatus(e.target.value)}>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>
      )}
      
      <div className="form-actions">
        <button type="submit" className="btn btn-save">{taskToEdit ? 'Save Changes' : 'Add Task'}</button>
        {taskToEdit && <button type="button" className="btn btn-cancel" onClick={clearEdit}>Cancel</button>}
      </div>
    </form>
  );
}
