import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllTasks, getUserTasks } from "../services/api";
import TaskCard from "../components/TaskCard";
import Modal from "../components/Modal";
import TaskForm from "../components/TaskForm";
import { useAuth } from "../context/AuthContext";
import {
  FaPlus,
  FaTasks,
  FaCheckCircle,
  FaHourglassHalf,
  FaTimesCircle,
  FaSearch,
  FaShieldAlt,
} from "react-icons/fa";

export default function DashboardPage() {
  const {
    isAdmin,
    currentUser,
    refreshUserData,
    getFullNameFromToken,
    parseTokenManually,
  } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [tokenFullName, setTokenFullName] = useState("");
  // Add debug function for token issues
  const debugTokenAndUpdateName = () => {
    console.log("Manual token debugging triggered");
    try {
      // First try the improved token function
      const name = getFullNameFromToken();
      if (name) {
        console.log("Found name from token:", name);
        setTokenFullName(name);
        // Show success message
        alert(`Successfully retrieved name: ${name}`);
        return;
      }

      // If that fails, try manual parsing
      if (parseTokenManually) {
        const tokenData = parseTokenManually();
        if (tokenData) {
          const foundName =
            tokenData.fullname ||
            tokenData.name ||
            tokenData.preferred_username ||
            tokenData.email;
          if (foundName) {
            console.log("Found name via manual parsing:", foundName);
            setTokenFullName(foundName);
            alert(`Found name via manual parsing: ${foundName}`);
            return;
          }
        }
      }

      alert(
        "Unable to extract name from token. Please check your login session."
      );
    } catch (e) {
      console.error("Error in debug function:", e);
      alert("Error extracting name: " + e.message);
    }
  };

  // useEffect to get user's name from token when component mounts
  useEffect(() => {
    if (currentUser) {
      console.log("Dashboard: Getting user name from token");
      try {
        const fullName = getFullNameFromToken();
        if (fullName) {
          console.log("Dashboard: Found user name:", fullName);
          setTokenFullName(fullName);
        } else {
          // Fallback to manual parsing
          const tokenData = parseTokenManually();
          if (tokenData && tokenData.fullname) {
            console.log(
              "Dashboard: Found name via manual parsing:",
              tokenData.fullname
            );
            setTokenFullName(tokenData.fullname);
          } else {
            // Use the current user data from context if available
            console.log("Dashboard: Using current user data as fallback");
            setTokenFullName(
              currentUser?.fullname || currentUser?.username || ""
            );
          }
        }
      } catch (error) {
        console.error("Error getting user name:", error);
        // Fallback to current user data
        setTokenFullName(currentUser?.fullname || currentUser?.username || "");
      }
    }
  }, [currentUser]);

  const {
    data: tasksResponse,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["tasks", isAdmin],
    queryFn: isAdmin ? getAllTasks : getUserTasks,
  });

  const tasks = useMemo(() => {
    if (!tasksResponse) return [];

    if (Array.isArray(tasksResponse)) return tasksResponse;

    if (tasksResponse.tasks && Array.isArray(tasksResponse.tasks)) {
      return tasksResponse.tasks;
    }

    if (tasksResponse.data && Array.isArray(tasksResponse.data)) {
      return tasksResponse.data;
    }

    console.warn("Unexpected API response format:", tasksResponse);
    return [];
  }, [tasksResponse]);

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

  const taskStats = {
    total: tasks.length,
    todo: tasks.filter((task) => task.status === "todo").length,
    done: tasks.filter((task) => task.status === "done").length,
    canceled: tasks.filter((task) => task.status === "cancel").length,
  };
  const filteredTasks = tasks.filter((task) => {
    if (filterStatus !== "all" && task.status !== filterStatus) return false;

    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      return (
        task.title.toLowerCase().includes(term) ||
        task.description.toLowerCase().includes(term)
      );
    }

    return true;
  }); // Refresh user data from JWT token when dashboard loads
  useEffect(() => {
    console.log("Dashboard: Running token effect hook");
    refreshUserData();

    // Try to get the name using our enhanced methods
    const getName = async () => {
      try {
        // Try standard method first
        let fullName = getFullNameFromToken();

        // If that doesn't work, try the debug function
        if (!fullName) {
          console.log(
            "Dashboard: Initial token name lookup failed, trying debug function"
          );
          // Call the debug function but suppress the alert
          const originalAlert = window.alert;
          window.alert = () => {};
          debugTokenAndUpdateName();
          window.alert = originalAlert;

          // The debug function sets tokenFullName directly, so we don't need to do anything else
        } else {
          console.log("Dashboard: Setting token full name:", fullName);
          setTokenFullName(fullName);
        }
      } catch (e) {
        console.error("Dashboard: Error getting name from token:", e);
      }
    };

    getName();

    // Set up an interval to check for token changes
    const interval = setInterval(() => {
      console.log("Dashboard: Checking for token name changes");
      const updatedName = getFullNameFromToken();
      if (updatedName && updatedName !== tokenFullName) {
        console.log("Dashboard: Updating token full name to:", updatedName);
        setTokenFullName(updatedName);
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []); // No dependencies to prevent re-running unnecessarily

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);

  const groupedTasks = {
    overdue: [],
    today: [],
    thisWeek: [],
    later: [],
  };

  filteredTasks.forEach((task) => {
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    if (dueDate < today && task.status !== "done") {
      groupedTasks.overdue.push(task);
    } else if (dueDate.getTime() === today.getTime()) {
      groupedTasks.today.push(task);
    } else if (dueDate >= today && dueDate <= nextWeek) {
      groupedTasks.thisWeek.push(task);
    } else {
      groupedTasks.later.push(task);
    }
  });
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-white to-sky-100 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Dashboard Header with Admin badge if applicable */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
              <FaTasks className="text-blue-600" />
              Task Dashboard
              {isAdmin && (
                <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full flex items-center ml-2">
                  <FaShieldAlt className="mr-1" size={10} />
                  ADMIN
                </span>
              )}
            </h1>{" "}
            
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition shadow-sm"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <button
              onClick={handleAddTask}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2 rounded-lg shadow-lg font-semibold transition"
            >
              <FaPlus /> Add New Task
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {taskStats.total}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FaTasks className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-yellow-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">To Do</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {taskStats.todo}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <FaHourglassHalf className="text-yellow-600 text-xl" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Completed</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {taskStats.done}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <FaCheckCircle className="text-green-600 text-xl" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-red-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Canceled</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {taskStats.canceled}
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <FaTimesCircle className="text-red-600 text-xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-8">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFilterStatus("all")}
              className={`px-5 py-2 rounded-lg font-medium transition flex items-center gap-2
                ${
                  filterStatus === "all"
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-50 text-gray-700 hover:bg-blue-50 border border-gray-200"
                }`}
            >
              <FaTasks size={14} />
              All
              <span className="bg-white bg-opacity-20 text-xs py-0.5 px-2 rounded-full ml-1">
                {taskStats.total}
              </span>
            </button>
            <button
              onClick={() => setFilterStatus("todo")}
              className={`px-5 py-2 rounded-lg font-medium transition flex items-center gap-2
                ${
                  filterStatus === "todo"
                    ? "bg-yellow-500 text-white shadow-md"
                    : "bg-gray-50 text-gray-700 hover:bg-yellow-50 border border-gray-200"
                }`}
            >
              <FaHourglassHalf size={14} />
              To Do
              <span className="bg-white bg-opacity-20 text-xs py-0.5 px-2 rounded-full ml-1">
                {taskStats.todo}
              </span>
            </button>
            <button
              onClick={() => setFilterStatus("done")}
              className={`px-5 py-2 rounded-lg font-medium transition flex items-center gap-2
                ${
                  filterStatus === "done"
                    ? "bg-green-600 text-white shadow-md"
                    : "bg-gray-50 text-gray-700 hover:bg-green-50 border border-gray-200"
                }`}
            >
              <FaCheckCircle size={14} />
              Done
              <span className="bg-white bg-opacity-20 text-xs py-0.5 px-2 rounded-full ml-1">
                {taskStats.done}
              </span>
            </button>
            <button
              onClick={() => setFilterStatus("cancel")}
              className={`px-5 py-2 rounded-lg font-medium transition flex items-center gap-2
                ${
                  filterStatus === "cancel"
                    ? "bg-red-600 text-white shadow-md"
                    : "bg-gray-50 text-gray-700 hover:bg-red-50 border border-gray-200"
                }`}
            >
              <FaTimesCircle size={14} />
              Canceled
              <span className="bg-white bg-opacity-20 text-xs py-0.5 px-2 rounded-full ml-1">
                {taskStats.canceled}
              </span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center bg-white rounded-xl shadow-md p-12 mb-8">
            <div className="relative h-16 w-16">
              <div className="absolute top-0 left-0 h-full w-full border-4 border-blue-100 rounded-full"></div>
              <div className="absolute top-0 left-0 h-full w-full border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <p className="text-gray-600 mt-4 font-medium">
              Loading your tasks...
            </p>
          </div>
        ) : isError ? (
          <div className="bg-red-50 text-red-700 p-6 rounded-xl shadow-md mb-8 flex items-center border-l-4 border-red-500">
            <div className="bg-red-100 p-3 rounded-full mr-4">
              <FaTimesCircle className="text-red-600 text-xl" />
            </div>
            <div>
              <h3 className="font-bold">Error Loading Tasks</h3>
              <p>
                {error.message ||
                  "Failed to load tasks. Please try again later."}
              </p>
            </div>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center mb-8">
            <h3 className="text-gray-700 text-lg font-medium mb-2">
              No tasks found
            </h3>
            {searchTerm ? (
              <p className="text-gray-500">
                No results match your search "{searchTerm}".
              </p>
            ) : filterStatus !== "all" ? (
              <p className="text-gray-500">
                No {filterStatus} tasks found. Try changing the filter or adding
                a new task.
              </p>
            ) : (
              <p className="text-gray-500">
                You don't have any tasks yet. Click "Add New Task" to get
                started.
              </p>
            )}
            {/* Ẩn nút Add New Task nếu đang ở filter Canceled */}
            {filterStatus !== "cancel" && (
              <button
                onClick={handleAddTask}
                className="mt-6 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-sm font-medium transition"
              >
                <FaPlus size={14} /> Add New Task
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Grouped Tasks Sections */}
            {groupedTasks.overdue.length > 0 && (
              <div className="mb-8">
                <h2 className="font-bold text-lg text-red-700 mb-4 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-red-500"></span>
                  Overdue
                </h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {groupedTasks.overdue.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onEdit={handleEditTask}
                    />
                  ))}
                </div>
              </div>
            )}

            {groupedTasks.today.length > 0 && (
              <div className="mb-8">
                <h2 className="font-bold text-lg text-blue-700 mb-4 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-blue-500"></span>
                  Today
                </h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {groupedTasks.today.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onEdit={handleEditTask}
                    />
                  ))}
                </div>
              </div>
            )}

            {groupedTasks.thisWeek.length > 0 && (
              <div className="mb-8">
                <h2 className="font-bold text-lg text-indigo-700 mb-4 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-indigo-500"></span>
                  This Week
                </h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {groupedTasks.thisWeek.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onEdit={handleEditTask}
                    />
                  ))}
                </div>
              </div>
            )}

            {groupedTasks.later.length > 0 && (
              <div className="mb-8">
                <h2 className="font-bold text-lg text-gray-700 mb-4 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-gray-500"></span>
                  Later
                </h2>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {groupedTasks.later.map((task) => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onEdit={handleEditTask}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <TaskForm task={editingTask} onClose={handleCloseModal} />
      </Modal>
    </div>
  );
}
