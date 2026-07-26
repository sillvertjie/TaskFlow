import Link from "next/link";
import ColumnList from "@/components/columns/ColumnList";

interface BoardPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function BoardPage({ params }: BoardPageProps) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-background p-8 text-foreground">
      <Link
        href="/"
        className="mb-4 inline-block text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
      >
        ← Back to boards
      </Link>
      <h1 className="mb-6 text-3xl font-bold">Board</h1>
      <ColumnList boardId={id} />
    </main>
  );
}
