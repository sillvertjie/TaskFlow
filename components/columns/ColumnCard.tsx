import TaskList from "@/components/tasks/TaskList";

interface ColumnCardProps {
  id: string;
  name: string;
}

export default function ColumnCard({ id, name }: ColumnCardProps) {
  return (
    <div className="flex min-h-72 flex-col rounded-lg border bg-white p-4 shadow-sm">
      <h2 className="font-semibold text-gray-900">{name}</h2>

      <TaskList columnId={id} />
    </div>
  );
}
