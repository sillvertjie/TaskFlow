import Link from "next/link";

interface BoardCardProps {
  id: string;
  name: string;
}

export default function BoardCard({ id, name }: BoardCardProps) {
  return (
    <Link href={`/boards/${id}`} className="block">
      <div className="rounded-lg border bg-white p-4 text-black shadow-sm transition hover:shadow-md">
        <h2 className="font-semibold">{name}</h2>
      </div>
    </Link>
  );
}
