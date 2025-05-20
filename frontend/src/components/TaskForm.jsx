import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTask, updateTask } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function TaskForm({ task = null, onClose }) {
  const { currentUser, isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const isEditing = !!task;
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    dueDate: '',
    assignedTo: [],
  });
  
  const [error, setError] = useState('');
  const [assignee, setAssignee] = useState('');

  useEffect(() => {
    if (task) {
      // Format dates for input fields (YYYY-MM-DD)
      const formatDateForInput = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
      };
      
      setFormData({
        title: task.title || '',
        description: task.description || '',
        startDate: formatDateForInput(task.startDate) || '',
        dueDate: formatDateForInput(task.dueDate) || '',
        assignedTo: task.assignedTo ? (Array.isArray(task.assignedTo) ? task.assignedTo : [task.assignedTo]) : [],
      });
    }
  }, [task]);

  const { mutate: createTaskMutation, isPending: isCreating } = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      onClose();
    },
    onError: (error) => {
      setError(error.response?.data?.message || 'Failed to create task');
    },
  });

  const { mutate: updateTaskMutation, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, data }) => updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      onClose();
    },
    onError: (error) => {
      setError(error.response?.data?.message || 'Failed to update task');
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddAssignee = () => {
    if (assignee.trim()) {
      setFormData(prev => ({
        ...prev,
        assignedTo: [...prev.assignedTo, assignee.trim()]
      }));
      setAssignee('');
    }
  };

  const handleRemoveAssignee = (index) => {
    setFormData(prev => ({
      ...prev,
      assignedTo: prev.assignedTo.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (!formData.title.trim() || !formData.description.trim() || !formData.startDate || !formData.dueDate) {
      setError('Title, description, start date and due date are required');
      return;
    }
    
    const startDate = new Date(formData.startDate);
    const dueDate = new Date(formData.dueDate);
    
    if (dueDate < startDate) {
      setError('Due date cannot be before start date');
      return;
    }

    // Format dates to ISO string
    const payload = {
      ...formData,
      startDate: new Date(formData.startDate).toISOString(),
      dueDate: new Date(formData.dueDate).toISOString(),
    };

    if (isEditing) {
      updateTaskMutation({ id: task._id, data: payload });
    } else {
      createTaskMutation(payload);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">
        {isEditing ? 'Edit Task' : 'Create New Task'}
      </h2>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 h-24"
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-1">Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
        </div>
        
        {isAdmin && (
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Assigned To</label>
            <div className="flex">
              <input
                type="text"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                className="flex-grow border border-gray-300 rounded-l px-3 py-2"
                placeholder="Enter user ID"
              />
              <button
                type="button"
                onClick={handleAddAssignee}
                className="bg-blue-500 text-white px-4 py-2 rounded-r"
              >
                Add
              </button>
            </div>
            
            {formData.assignedTo.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 mb-1">Assigned users:</p>
                <div className="flex flex-wrap gap-2">
                  {formData.assignedTo.map((userId, index) => (
                    <div 
                      key={index} 
                      className="bg-gray-100 px-2 py-1 rounded flex items-center"
                    >
                      <span className="text-sm">{userId}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAssignee(index)}
                        className="ml-2 text-red-500 text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <p className="text-xs text-gray-500 mt-1">
              Leave empty to assign to yourself
            </p>
          </div>
        )}
        
        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={isCreating || isUpdating}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400"
          >
            {isCreating || isUpdating ? 'Saving...' : isEditing ? 'Update Task' : 'Create Task'}
          </button>
        </div>
      </form>
    </div>
  );
} 