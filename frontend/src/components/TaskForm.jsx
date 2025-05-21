import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask, updateTask } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { FaPlus, FaTimes, FaUser } from "react-icons/fa";

export default function TaskForm({ task = null, onClose }) {
  const { currentUser, isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const isEditing = !!task;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    dueDate: "",
    assignedTo: [],
  });

  const [error, setError] = useState("");
  const [assignee, setAssignee] = useState("");

  useEffect(() => {
    if (task) {
      // Format dates for input fields (YYYY-MM-DD)
      const formatDateForInput = (dateString) => {
        const date = new Date(dateString);
        return date.toISOString().split("T")[0];
      };

      setFormData({
        title: task.title || "",
        description: task.description || "",
        startDate: formatDateForInput(task.startDate) || "",
        dueDate: formatDateForInput(task.dueDate) || "",
        assignedTo: task.assignedTo
          ? Array.isArray(task.assignedTo)
            ? task.assignedTo
            : [task.assignedTo]
          : [],
      });
    }
  }, [task]);

  const { mutate: createTaskMutation, isPending: isCreating } = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      onClose();
    },
    onError: (error) => {
      setError(error.response?.data?.message || "Failed to create task");
    },
  });

  const { mutate: updateTaskMutation, isPending: isUpdating } = useMutation({
    mutationFn: ({ id, data }) => updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      onClose();
    },
    onError: (error) => {
      setError(error.response?.data?.message || "Failed to update task");
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddAssignee = () => {
    if (assignee.trim()) {
      setFormData((prev) => ({
        ...prev,
        assignedTo: [...prev.assignedTo, assignee.trim()],
      }));
      setAssignee("");
    }
  };

  const handleRemoveAssignee = (index) => {
    setFormData((prev) => ({
      ...prev,
      assignedTo: prev.assignedTo.filter((_, i) => i !== index),
    }));
  };

  // Example of how your form submission might look
  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.startDate ||
      !formData.dueDate
    ) {
      setError("Title, description, start date and due date are required");
      return;
    }

    const startDate = new Date(formData.startDate);
    const dueDate = new Date(formData.dueDate);

    if (dueDate < startDate) {
      setError("Due date cannot be before start date");
      return;
    }

    // Format dates to ISO string
    const payload = {
      ...formData,
      startDate: new Date(formData.startDate).toISOString(),
      dueDate: new Date(formData.dueDate).toISOString(),
      // Ensure assignedTo is always an array
      assignedTo: Array.isArray(formData.assignedTo) ? formData.assignedTo : [],
    };

    if (isEditing) {
      updateTaskMutation({ id: task._id, data: payload });
    } else {
      createTaskMutation(payload);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-lg mx-auto">
      {/* Form header with badge */}
      <h2 className="text-2xl font-bold mb-6 text-blue-700 flex items-center gap-2">
        {isEditing ? (
          <>
            <span className="inline-block bg-blue-100 text-blue-600 rounded-full px-3 py-1 text-xs font-semibold">
              Edit
            </span>
            Edit Task
          </>
        ) : (
          <>
            <span className="inline-block bg-green-100 text-green-600 rounded-full px-3 py-1 text-xs font-semibold">
              New
            </span>
            Create New Task
          </>
        )}
      </h2>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6 text-center font-medium border-l-4 border-red-500 shadow-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title field */}
        <div className="mb-5">
          <label className="block text-gray-700 mb-2 font-medium">
            Title
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition shadow-sm"
            required
          />
        </div>

        {/* Description field */}
        <div className="mb-5">
          <label className="block text-gray-700 mb-2 font-medium">
            Description
            <span className="text-red-500 ml-1">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 h-32 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition shadow-sm"
            required
          />
        </div>

        {/* Date fields in grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Start Date
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition shadow-sm"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Due Date
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition shadow-sm"
              required
            />
          </div>
        </div>

        {/* Assignee section - available to all users */}
        <div className="mb-5 pt-4 border-t border-gray-100">
          <label className="flex items-center gap-2 text-gray-700 mb-2 font-medium">
            <FaUser className="text-blue-500" />
            Assign Task To
          </label>

          <div className="flex shadow-sm">
            <input
              type="text"
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              className="flex-grow border border-gray-300 rounded-l-lg px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
              placeholder="Enter username to assign"
            />
            <button
              type="button"
              onClick={handleAddAssignee}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg transition flex items-center gap-1"
            >
              <FaPlus size={14} /> Add
            </button>
          </div>

          {/* Assignee tags */}
          {formData.assignedTo.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {formData.assignedTo.map((userId, index) => (
                <div
                  key={index}
                  className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full flex items-center text-sm border border-blue-100 shadow-sm hover:bg-blue-100 transition"
                >
                  <span className="font-medium">{userId}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveAssignee(index)}
                    className="ml-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full h-5 w-5 flex items-center justify-center transition"
                    title="Remove assignee"
                    aria-label={`Remove ${userId}`}
                  >
                    <FaTimes size={10} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {isAdmin ? (
            <p className="text-xs text-gray-500 mt-2 flex items-center">
              <span className="inline-block bg-gray-100 rounded-full w-4 h-4 text-center text-xs mr-1">
                i
              </span>
              As admin, you can assign tasks to any user
            </p>
          ) : (
            <p className="text-xs text-gray-500 mt-2 flex items-center">
              <span className="inline-block bg-gray-100 rounded-full w-4 h-4 text-center text-xs mr-1">
                i
              </span>
              Leave empty to assign to yourself
            </p>
          )}
        </div>

        {/* Form actions */}
        <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition font-medium focus:outline-none focus:ring focus:ring-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isCreating || isUpdating}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition disabled:bg-blue-300 disabled:cursor-not-allowed focus:outline-none focus:ring focus:ring-blue-200"
          >
            {isCreating || isUpdating
              ? "Saving..."
              : isEditing
              ? "Update Task"
              : "Create Task"}
          </button>
        </div>
      </form>
    </div>
  );
}
