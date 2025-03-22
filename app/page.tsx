import Loading from "@/components/loading";
import { TaskManager } from "@/components/task-manager";
import { Suspense } from "react";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Suspense fallback={<Loading />}>
        <TaskManager />
      </Suspense>
    </main>
  );
}
