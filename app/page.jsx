import styles from "./page.module.css";
import Electricity from "../components/electricity/Electricity.jsx";

export default function Home() {
  return (
    <main className={styles.main}>
        <Electricity></Electricity>
    </main>
  );
}
