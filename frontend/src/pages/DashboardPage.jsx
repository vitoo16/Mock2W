import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllTasks } from '../services/api';
import TaskCard from '../components/TaskCard';
import Modal from '../components/Modal';
import TaskForm from '../components/TaskForm';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { isAdmin } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  
  const { data: tasks = [], isLoading, isError, error } = useQuery({
    queryKey: ['tasks'],
    queryFn: getAllTasks,
  });

  const handleAddTask = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filterStatus === 'all') return true;
    return task.status === filterStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Task Dashboard</h1>
          <button
            onClick={handleAddTask}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Add New Task
          </button>
        </div>

        <div className="mb-6">
          <div className="flex space-x-4">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded ${
                filterStatus === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus('todo')}
              className={`px-4 py-2 rounded ${
                filterStatus === 'todo'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              To Do
            </button>
            <button
              onClick={() => setFilterStatus('done')}
              className={`px-4 py-2 rounded ${
                filterStatus === 'done'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              Done
            </button>
            <button
              onClick={() => setFilterStatus('cancel')}
              className={`px-4 py-2 rounded ${
                filterStatus === 'cancel'
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              Canceled
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-10">
            <p className="text-gray-500">Loading tasks...</p>
          </div>
        ) : isError ? (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
            Error: {error.message || 'Failed to load tasks'}
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <p className="text-gray-500">No tasks found</p>
            {filterStatus !== 'all' && (
              <p className="text-sm text-gray-400 mt-1">
                Try changing your filter or adding a new task
              </p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={handleEditTask}
              />
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <TaskForm task={editingTask} onClose={handleCloseModal} />
      </Modal>
    </div>
  );
} 