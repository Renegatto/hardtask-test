
import { CaptureForm } from "./capture-form";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <CaptureForm/>
      </main>
      <footer className={styles.footer}>
      </footer>
    </div>
  );
}
