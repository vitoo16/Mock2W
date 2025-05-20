import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTaskStatus, softDeleteTask, hardDeleteTask } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function TaskCard({ task, onEdit }) {
  const { currentUser, isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [isExpanded, setIsExpanded] = useState(false);

  const { mutate: completeTask } = useMutation({
    mutationFn: () => updateTaskStatus(task._id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const { mutate: cancelTask } = useMutation({
    mutationFn: () => softDeleteTask(task._id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const { mutate: deleteTask } = useMutation({
    mutationFn: () => hardDeleteTask(task._id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const canEdit = isAdmin || task.createdBy === currentUser.id;
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'todo': return 'bg-yellow-100 text-yellow-800';
      case 'done': return 'bg-green-100 text-green-800';
      case 'cancel': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4 border-l-4 border-blue-500">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{task.title}</h3>
          <p className="text-sm text-gray-500">
            Due: {formatDate(task.dueDate)}
          </p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
          {task.status.toUpperCase()}
        </span>
      </div>
      
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-sm text-blue-600 mt-2"
      >
        {isExpanded ? 'Show less' : 'Show more'}
      </button>
      
      {isExpanded && (
        <div className="mt-2">
          <p className="text-gray-700 mb-2">{task.description}</p>
          <div className="text-sm text-gray-500">
            <p>Start date: {formatDate(task.startDate)}</p>
            <p>Assigned to: {task.assignedTo || 'Not assigned'}</p>
            <p>Created by: {task.createdBy}</p>
          </div>
        </div>
      )}
      
      {canEdit && task.status !== 'done' && task.status !== 'cancel' && (
        <div className="mt-3 flex space-x-2">
          <button
            onClick={() => onEdit(task)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
          >
            Edit
          </button>
          <button
            onClick={() => completeTask()}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
          >
            Complete
          </button>
          <button
            onClick={() => cancelTask()}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm"
          >
            Cancel
          </button>
          {isAdmin && (
            <button
              onClick={() => deleteTask()}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
} 