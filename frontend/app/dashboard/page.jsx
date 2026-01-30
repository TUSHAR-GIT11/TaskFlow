import CreateTaskForm from "../components/createTaskForm";
import DashboardStats from "../components/dashboardStats";
import TaskList from "../components/tasklist";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header */}
        <header>
          <h1 className="text-3xl font-bold text-gray-800">
            Dashboard
          </h1>
          <p className="text-gray-500">
            Manage your tasks and workflow
          </p>
        </header>

        {/* Create Task */}
        <DashboardStats/>
        <CreateTaskForm />

        {/* Task List */}
        <TaskList />
        

      </div>
    </main>
  );
}
