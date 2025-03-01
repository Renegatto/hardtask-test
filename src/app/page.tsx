"use client"
import { NewHardtask, submittedFormToTask } from "./new-hardtask/components/new-hardtask";
import styles from "./page.module.css";
import { TaskForm } from "./new-hardtask/components/task-form";
import { publishTask } from "./new-hardtask/endpoint-data";

export default function Home() {
  return (
    <div className={styles["page"]}>
      <main className={styles["main"]}>
        <NewHardtask
          publishTask={publishTask}
          TaskForm={(onSubmit,isTransition) =>
            <TaskForm
              isTransition={isTransition}
              onSubmit={form => onSubmit(submittedFormToTask(form))}
            />
          }
        />
      </main>
      <footer className={styles["footer"]}>
      </footer>
    </div>
  );
}
