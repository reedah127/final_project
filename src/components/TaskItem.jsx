import React from 'react';

export default function TaskItem({ task, API_URL, token, onEditClick, onTasksUpdated, triggerAlert }) {
  const toggleStatus = async () => {
    const nextStatus = task.status === 'Pending' ? 'Completed' : 'Pending';
    try {
      const res = await fetch(`${API_URL}/tasks/${task._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: nextStatus })
      });
      if (!res.ok) throw new Error('Status configuration alteration error');
      onTasksUpdated();
    } catch (err) {
      triggerAlert(err.message, 'error');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to discard this item permanently?')) return;
    try {
      const res = await fetch(`${API_URL}/tasks/${task._id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Deletion validation sequence failed');
      triggerAlert('Task removed securely.', 'success');
      onTasksUpdated();
    } catch (err) {
      triggerAlert(err.message, 'error');
    }
  };

  return (
    <div className={`task-item ${task.status.toLowerCase()}`}>
      <div className="task-details" onClick={toggleStatus} title="Click to toggle completion status">
        <div className={`checkbox ${task.status.toLowerCase()}`}>
          {task.status === 'Completed' && '✓'}
        </div>
        <span className="task-title-text">{task.title}</span>
      </div>
      <div className="task-actions">
        <button onClick={() => onEditClick(task)} className="btn-icon edit-btn" title="Modify Context">Edit</button>
        <button onClick={handleDelete} className="btn-icon delete-btn" title="Purge Task">Delete</button>
      </div>
    </div>
  );
}
