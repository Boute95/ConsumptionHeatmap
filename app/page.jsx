import styles from "./page.module.css";
import Electricity from "../components/electricity/Electricity.jsx";
import getNivoData from "../components/electricity/getNivoData.js";
import { Suspense } from "react";

export default async function Page() {
  const res = await getNivoData();
  return (
    <main className={styles.main}>
      <Suspense fallback={<p>Loading...</p>}>
        {res.data.map((year, idx) => (
          <Electricity key={idx} days={year} meta={res.meta}></Electricity>
        ))}
      </Suspense>
    </main>
  );
}
