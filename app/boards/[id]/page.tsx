import ColumnList from "@/components/columns/ColumnList";

interface BoardPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function BoardPage({ params }: BoardPageProps) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-black p-8 text-white">
      <h1 className="mb-6 text-3xl font-bold">Board</h1>

      <ColumnList boardId={id} />
    </main>
  );
}
