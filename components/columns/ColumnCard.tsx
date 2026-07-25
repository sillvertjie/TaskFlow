interface ColumnCardProps {
  name: string;
}

export default function ColumnCard({ name }: ColumnCardProps) {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <h2 className="font-semibold">{name}</h2>

      <p className="mt-4 text-sm text-gray-500">No tasks yet</p>
    </div>
  );
}
