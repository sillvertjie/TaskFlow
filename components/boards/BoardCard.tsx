interface BoardCardProps {
  id: string;
  name: string;
}

export default function BoardCard({ name }: BoardCardProps) {
  return (
    <div className="rounded-lg border p-4 shadow-sm">
      <h2 className="text-lg font-semibold">{name}</h2>
    </div>
  );
}
