import data from "../../data/consommation_electricite.csv";

export default function Page() {
  let outArray = new Array();
  let currentDate;
  for (let i = 0; i < data.length - 1; i++) {
    const date = data[i].date;
    const puiss = data[i].puissance;
    if (date && !puiss) {
      currentDate = date;
    } else if (puiss) {
      outArray.push({
        date: currentDate,
        heure: date,
        puissance: puiss,
      });
    }
  }

  let outCsv = [
    ["date", "heure", "energie"],
    ...outArray.map((item) => [item.date, item.heure, item.puissance]),
  ]
    .map((e, idx) => e.join(","))
    .join("\n");
  outCsv = "data:text/csv;charset=utf-8," + outCsv;
  let outUri = encodeURI(outCsv);

  return (
    <>
      <a href={outUri}>Download</a>
      <ul>
        {/* {outArray.map((e, idx) => (
          <li key={idx}>
            {e.date} ; {e.heure} ; {e.puissance}
          </li>
        ))} */}
      </ul>
    </>
  );
}
