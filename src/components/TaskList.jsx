import React, { useState, useEffect } from 'react';
import TaskItem from './TaskItem';

export default function TaskList({ API_URL, token, refreshTrigger, onEditClick, onTasksUpdated, triggerAlert }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch(`${API_URL}/tasks`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Could not pull your task listings');
        const data = await res.json();
        setTasks(data);
      } catch (err) {
        triggerAlert(err.message, 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [token, refreshTrigger]);

  if (loading) return <p className="loading-txt">Syncing your dashboard database...</p>;
  if (tasks.length === 0) return <p className="empty-txt">No tasks found. Create one above to get started!</p>;

  return (
    <div className="task-list">
      {tasks.map(task => (
        <TaskItem 
          key={task._id} 
          task={task} 
          API_URL={API_URL} 
          token={token} 
          onEditClick={onEditClick} 
          onTasksUpdated={onTasksUpdated} 
          triggerAlert={triggerAlert} 
        />
      ))}
    </div>
  );
}
