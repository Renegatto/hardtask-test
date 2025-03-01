"use client"
import { NewHardtask } from "./new-hardtask/components/new-hardtask";
import styles from "./page.module.css";
import { TaskForm } from "./new-hardtask/components/task-form";
import { publishTask } from "./new-hardtask/endpoint-data";

export default function Home() {
  return (
    <div className={styles["page"]}>
      <main className={styles["main"]}>
        <NewHardtask
          publishTask={publishTask}
          TaskForm={TaskForm}
        />
      </main>
      <footer className={styles["footer"]}>
      </footer>
    </div>
  );
}
