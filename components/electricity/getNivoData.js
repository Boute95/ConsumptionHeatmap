import data from "../../data/mes-puissances-atteintes-30min-22408972440918-77500.csv";

////////////////////////////////////////////////////////////////////////////////
export default async function getNivoData() {
  const outData = AppCsvToNivoData(EdfCsvToAppCsv(getTmpRawData(data)));
  const outMeta = getMetaData(outData);
  return {
    data: outData,
    meta: outMeta,
  };
}

///////////////////////////////////////////////////////////////////////////////
function getTmpRawData() {
  let ret = data.slice(0, 3200);
  return ret;
}

////////////////////////////////////////////////////////////////////////////////
function EdfCsvToAppCsv(inCsv) {
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

///////////////////////////////////////////////////////////////////////////////
function getMetaData(data) {
  let ret_meta = {
    minEnergie: null,
    maxEnergie: 0,
  };

  for (let day of data) {
    for (let cell of day.data) {
      if (cell.y > ret_meta.maxEnergie) {
        ret_meta.maxEnergie = cell.y;
      }
      if (!ret_meta.minEnergie || cell.y < ret_meta.minEnergie) {
        ret_meta.minEnergie = cell.y;
      }
    }
  }

  return ret_meta;
}

///////////////////////////////////////////////////////////////////////////////
function AppCsvToNivoData(data) {
  let nivo = [];
  let idx = 0;
  for (let row of data) {
    if (!row.energie && isDate(row.date)) {
      nivo.push({ id: row.date, data: [] });
    } else if (row.energie) {
      let currDay = nivo[nivo.length - 1];
      const newCell = {
        x: row.date,
        y: row.energie,
      };
      if (!cellAlreadyExists(currDay.data, newCell)) {
        currDay.data.push(newCell);
      }
    }
  }
  return nivo;
}

///////////////////////////////////////////////////////////////////////////////
function cellAlreadyExists(dayArray, newCell) {
  for (let cell of dayArray) {
    if (cell.x == newCell.x) {
      return true;
    }
  }
  return false;
}

////////////////////////////////////////////////////////////////////////////////
function isDate(str) {
  return str.match(/[0-9]*\/[0-9]*\/[0-9]*/);
}

////////////////////////////////////////////////////////////////////////////////
function deepCopy(arr) {
  return JSON.parse(JSON.stringify(arr));
}
