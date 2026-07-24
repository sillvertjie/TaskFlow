import BoardList from "@/components/boards/BoardList";

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <header>
          <h1 className="text-4xl font-bold">TaskFlow</h1>

          <p className="text-gray-600">Manage your boards</p>
        </header>

        <BoardList />
      </div>
    </main>
  );
}
