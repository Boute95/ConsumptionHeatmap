import styles from "./page.module.css";
import Electricity from "../components/electricity/Electricity.jsx";

export default function Home() {
  return (
    <main className={styles.main}>
      <div id="d3Content">
        <Electricity></Electricity>
      </div>
    </main>
  );
}
