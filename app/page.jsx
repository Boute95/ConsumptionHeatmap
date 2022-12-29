import styles from "./page.module.css";
import Electricity from "../components/electricity/Electricity.jsx";
import getNivoData from "../components/electricity/getNivoData.js";
import { Suspense } from "react";

export default async function Page() {
  const res = await getNivoData();
  return (
    <main className={styles.main}>
      <Suspense fallback={<p>Loading...</p>}>
        <Electricity data={res.data} meta={res.meta}></Electricity>
      </Suspense>
    </main>
  );
}
