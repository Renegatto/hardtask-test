"use client"
import { FC } from "react";
import { CaptureForm } from "./capture-form";
import styles from "./page.module.css";
import { TaskForm } from "./capture-form/task-form";
import { publishTask } from "./capture-form/endpoint-data";

export default function Home() {
  return (
    <div className={styles["page"]}>
      <main className={styles["main"]}>
        <CaptureForm
          publishTask={publishTask}
          Form={TaskForm}
        />
      </main>
      <footer className={styles["footer"]}>
      </footer>
    </div>
  );
}
