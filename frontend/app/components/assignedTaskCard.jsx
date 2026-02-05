export default function AssignedTaskCard({ task }) {
  if(!task) return null;
  return (

    <div className="border-l-4 border-blue-600 bg-blue-50 p-4 rounded-lg shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-gray-800">
            {task.title}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {task.description}
          </p>
          <p className="text-xs text-blue-600 mt-2 font-medium">
            Assigned task
          </p>
        </div>
        <span className="px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-700">
          {task.status}
        </span>
      </div>
    </div>
  );
}