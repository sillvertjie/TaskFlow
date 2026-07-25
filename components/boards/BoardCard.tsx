import Link from "next/link";

interface BoardCardProps {
  id: string;
  name: string;
}

export default function BoardCard({ id, name }: BoardCardProps) {
  return (
    <Link href={`/boards/${id}`} className="block">
      <div className="flex h-72 flex-col rounded-lg border bg-white p-4 shadow-sm">
        <h2 className="font-semibold">{name}</h2>
      </div>
    </Link>
  );
}
