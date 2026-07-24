import Header from "@/components/layout/Header";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />

      <section className="flex min-h-[80vh] items-center justify-center">
        <h2 className="text-4xl font-bold">TaskFlow</h2>
      </section>
    </main>
  );
}
