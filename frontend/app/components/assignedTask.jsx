import { MY_TASKS } from "../graphql/queries";
import AssignedTaskCard from "./AssignedTaskCard";

export default function AssignedTask() {
  const { data, loading } = useQuery(MY_TASKS);
  if (loading) {
    return <p>loading...</p>;
  }
  return (
    <div>
      {data?.myTasks
        ?.filter((task) => task && task.id)
        .map((task) => (
          <AssignedTaskCard key={task.id} task={task} />
        ))}
    </div>
  );
}
