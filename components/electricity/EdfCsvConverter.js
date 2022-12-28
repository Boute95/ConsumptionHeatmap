////////////////////////////////////////////////////////////////////////////////
export default function EdfCsvToAppCsv(inCsv) {
  // let outCsv = new Array();
  let outCsv = deepCopy(inCsv);
  outCsv = outCsv.slice(1);
  renameKeys(outCsv);
  return outCsv;

  // for (let i = 0; i < data.length - 1; i++) {
  //   const date = data[i].date;
  //   const puiss = data[i].puissance;
  //   if (date && !puiss) {
  //     currentDate = date;
  //   } else if (puiss) {
  //     outArray.push({
  //       date: currentDate,
  //       heure: date,
  //       puissance: puiss,
  //     });
  //   }
  // }

  // let outCsv = [
  //   ["date", "heure", "energie"],
  //   ...outArray.map((item) => [item.date, item.heure, item.puissance]),
  // ]
  //   .map((e, idx) => e.join(","))
  //   .join("\n");
  // outCsv = "data:text/csv;charset=utf-8," + outCsv;
  // let outUri = encodeURI(outCsv);

  // return (
  //   <>
  //     {/* <a href={outUri}>Download</a> */}
  //     <ul>
  //       {/* {outArray.map((e, idx) => (
  //         <li key={idx}>
  //           {e.date} ; {e.heure} ; {e.puissance}
  //         </li>
  //       ))} */}
  //     </ul>
  //   </>
  // );
}

////////////////////////////////////////////////////////////////////////////////
function renameKeys(inCsv) {
  const oldDateKey = "R�capitulatif de mes puissances atteintes en W";
  for (let line of inCsv) {
    // date
    line["date"] = line[oldDateKey];
    delete line[oldDateKey];
    // energie
    if (line["__parsed_extra"]) {
      line["energie"] = line["__parsed_extra"][0];
    } else {
      line["energie"] = null;
    }
    delete line["__parsed_extra"];
  }
}

////////////////////////////////////////////////////////////////////////////////
function isDate(str) {
  return str.match(/[0-9]*\/[0-9]*\/[0-9]*/);
}

////////////////////////////////////////////////////////////////////////////////
function deepCopy(arr) {
  return JSON.parse(JSON.stringify(arr));
}
