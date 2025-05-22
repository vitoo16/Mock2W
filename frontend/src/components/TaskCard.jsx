import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateTaskStatus,
  softDeleteTask,
  hardDeleteTask,
} from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  FaCheck,
  FaEdit,
  FaTimes,
  FaTrash,
  FaChevronDown,
  FaChevronUp,
  FaUser,
  FaCalendarAlt,
  FaClock,
} from "react-icons/fa";

export default function TaskCard({ task, onEdit }) {
  console.log("assignedTo:", task.assignedTo); 
  const { currentUser, isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const { mutate: completeTask } = useMutation({
    mutationFn: () => updateTaskStatus(task._id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
  const isCreator = currentUser && task.createdBy === currentUser.fullname;

  const { mutate: cancelTask } = useMutation({
    mutationFn: () => softDeleteTask(task._id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const { mutate: deleteTask } = useMutation({
    mutationFn: () => hardDeleteTask(task._id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const isPastDue =
    new Date(task.dueDate) < new Date() && task.status === "todo";

  const getStatusStyles = (status) => {
    switch (status) {
      case "todo":
        return {
          badge: "bg-yellow-50 text-yellow-800 border-yellow-300",
          border: "border-l-yellow-500",
        };
      case "done":
        return {
          badge: "bg-green-50 text-green-800 border-green-300",
          border: "border-l-green-500",
        };
      case "cancel":
        return {
          badge: "bg-red-50 text-red-800 border-red-300",
          border: "border-l-red-500",
        };
      default:
        return {
          badge: "bg-gray-50 text-gray-800 border-gray-300",
          border: "border-l-blue-500",
        };
    }
  };

  const statusStyles = getStatusStyles(task.status);

  // Lấy id của người tạo task (dù là object hay string)
  const createdById =
    typeof task.createdBy === "object" && task.createdBy !== null
      ? task.createdBy._id
      : task.createdBy;

  return (
    <div
      className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 ${statusStyles.border} border-l-4 relative overflow-hidden group`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Bubble pattern decorations */}
      <div className="absolute -top-12 -right-12 w-24 h-24 bg-blue-400/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="absolute -bottom-8 -left-8 w-16 h-16 bg-indigo-300/5 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100"></div>
      
      {/* Small decorative bubbles that appear on hover */}
      <div className="absolute top-4 right-8 w-2 h-2 bg-blue-300/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200"></div>
      <div className="absolute bottom-6 left-10 w-1.5 h-1.5 bg-indigo-200/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-300"></div>
      <div className="absolute top-1/2 right-4 w-1 h-1 bg-purple-300/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-150"></div>
      
      <div className="p-5 relative z-10">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 group/title">
              <span className="group-hover/title:text-blue-600 transition-colors relative">
                {task.title}
                {/* Underline animation */}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 opacity-0 group-hover/title:w-full group-hover/title:opacity-100 transition-all duration-300"></span>
              </span>
              {task.status === "done" && (
                <FaCheck className="text-green-500" title="Completed" />
              )}
              {task.status === "cancel" && (
                <FaTimes className="text-red-500" title="Canceled" />
              )}
              {isPastDue && (
                <span className="bg-red-100 text-red-700 text-xs px-1.5 py-0.5 rounded-sm flex items-center relative overflow-hidden">
                  <FaClock className="mr-1" size={10} /> OVERDUE
                  {/* Flashing animation for overdue */}
                  <span className="absolute inset-0 bg-red-200/50 animate-pulse opacity-0"></span>
                </span>
              )}
            </h3>

            <p className="text-sm text-gray-500 mt-1 flex items-center">
              <FaCalendarAlt className="mr-1.5 text-gray-400" size={12} />
              <span className="font-medium">Due: </span>
              <span
                className={`ml-1 ${
                  isPastDue ? "text-red-600 font-medium" : ""
                }`}
              >
                {formatDate(task.dueDate)}
              </span>
            </p>
          </div>

          <div className="flex flex-col items-center gap-2">
  {/* Badge trạng thái chỉ để hiển thị */}
  <span
    className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusStyles.badge} relative overflow-hidden`}
    style={{ display: "inline-block" }}
  >
    {task.status === "todo"
      ? "TO DO"
      : task.status === "in_progress"
      ? "IN PROGRESS"
      : task.status.toUpperCase()}
  </span>

  {/* Nút update status, chỉ hiện khi được phép */}
  
    {task.status === "todo" && (
    <button
      onClick={(e) => {
        e.stopPropagation();
        completeTask();
      }}
      className="px-5 py-1 rounded-full text-xs bg-green-500 font-semibold border text-white transition"
      style={{ outline: "none", display: "inline-block" }}
      title="Finish"
      type="button"
    >
      Finish
    </button>
     )}
</div>
        </div>

        {!isExpanded && task.description && (
          <p className="mt-3 text-gray-600 text-sm line-clamp-1">
            {task.description}
          </p>
        )}

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 text-sm mt-3 focus:outline-none focus:text-blue-800 relative group/btn"
        >
          {/* Button bubble effect */}
          <span className="absolute -left-2 w-0 h-0.5 bg-blue-200/50 group-hover/btn:w-full transition-all duration-300 rounded-full"></span>
          {isExpanded ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
          {isExpanded ? "Show less" : "Show details"}
        </button>

        {isExpanded && (
          <div className="mt-4 space-y-3 text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-100 relative overflow-hidden">
            {/* Expanded section bubbles */}
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-blue-300/5 rounded-full blur-lg"></div>
            <div className="absolute -bottom-10 -left-10 w-16 h-16 bg-indigo-200/5 rounded-full blur-md"></div>
            
            <div className="relative z-10">
              <h4 className="font-medium text-sm text-gray-800 mb-1">
                Description:
              </h4>
              <p className="text-sm">{task.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm relative z-10">
              <div>
                <h4 className="font-medium text-gray-800">Start date:</h4>
                <p>{formatDate(task.startDate)}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Due date:</h4>
                <p className={isPastDue ? "text-red-600" : ""}>
                  {formatDate(task.dueDate)}
                </p>
              </div>
            </div>

            <div className="relative z-10">
              <h4 className="font-medium text-gray-800 flex items-center gap-1">
                <FaUser className="text-blue-400" size={12} /> Assigned to:
              </h4>

              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {Array.isArray(task.assignedTo)
  ? (task.assignedTo.length > 0
      ? task.assignedTo.map((user, idx) => (
          <span
            key={idx}
            className="inline-block bg-blue-50 border border-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs relative overflow-hidden group/tag"
          >
            {user}
          </span>
        ))
      : <span className="text-gray-500 text-xs italic">Not assigned</span>
    )
  : (task.assignedTo
      ? <span className="inline-block bg-blue-50 border border-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs relative overflow-hidden group/tag">{task.assignedTo}</span>
      : <span className="text-gray-500 text-xs italic">Not assigned</span>
    )
}
              </div>
            </div>

            <div className="text-xs text-gray-500 relative z-10">
              <span className="font-medium">Created by:</span> {task.createdBy}
            </div>
          </div>
        )}


  {(isAdmin || isCreator) && task.status !== "done" && task.status !== "cancel" && (
  <div className="mt-4 flex flex-wrap gap-2">
    <button
      onClick={() => onEdit(task)}
      className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-1"
    >
      <FaEdit /> Edit
    </button>
    <button
      onClick={() => cancelTask()}
      className="bg-yellow-500 text-white px-4 py-2 rounded flex items-center gap-1"
    >
      <FaTimes /> Cancel
    </button>
    <button
      onClick={() => deleteTask()}
      className="bg-red-600 text-white px-4 py-2 rounded flex items-center gap-1"
    >
      <FaTrash /> Delete
    </button>
  </div>
)}
      </div>
    </div>
  );
}
