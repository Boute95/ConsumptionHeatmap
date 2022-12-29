import data from "../../data/mes-puissances-atteintes-30min-22408972440918-77500.csv";

////////////////////////////////////////////////////////////////////////////////
export default async function getNivoData() {
  const outData = AppCsvToNivoDataByYear(EdfCsvToAppCsv(data));
  const outMeta = getMetaData(outData);
  return {
    data: outData,
    meta: outMeta,
  };
}

////////////////////////////////////////////////////////////////////////////////
function EdfCsvToAppCsv(inCsv) {
  let outCsv = deepCopy(inCsv);
  outCsv = outCsv.slice(1);
  renameKeys(outCsv);
  return outCsv;
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

  for (let year of data) {
    for (let day of year) {
      for (let cell of day.data) {
        if (cell.y > ret_meta.maxEnergie) {
          ret_meta.maxEnergie = cell.y;
        }
        if (!ret_meta.minEnergie || cell.y < ret_meta.minEnergie) {
          ret_meta.minEnergie = cell.y;
        }
      }
    }
  }

  return ret_meta;
}

///////////////////////////////////////////////////////////////////////////////
function AppCsvToNivoDataByYear(data) {
  let ret_years = [];
  let currYearIdx = null;
  let currYear = "0000";
  let currDayIdx = null;
  let currDay = null;

  for (let row of data) {
    // Caching the current day if exists
    if (currYearIdx !== null && currDayIdx !== null) {
      currDay = ret_years[currYearIdx][currDayIdx];
    }

    // row is Date only
    if (!row.energie && isDate(row.date)) {
      if (currDay) {
        currDay.data.reverse();
      }
      if (isANewYear(row.date, currYear)) {
        ret_years.push([]);
        currYearIdx = currYearIdx !== null ? currYearIdx + 1 : 0;
        currYear = row.date.split("/")[2];
        currDayIdx = null;
        currDay = null;
      }
      let newDay = { id: row.date, data: [] };
      ret_years[currYearIdx].push(newDay);
      currDayIdx = currDayIdx !== null ? currDayIdx + 1 : 0;
    }

    // row is a Hour and energy
    else if (row.energie) {
      const newCell = {
        x: row.date,
        y: row.energie,
      };
      if (cellIsCorrupted(newCell)) {
        console.log("Corrupted cell : time is " + newCell.x);
        console.log("Ignoring current cell");
      } else if (!cellAlreadyExists(currDay.data, newCell)) {
        currDay.data.push(newCell);
      }
    }
  }

  return ret_years;
}

///////////////////////////////////////////////////////////////////////////////
function isANewYear(date, currYear) {
  const ddmmyyyy = date.split("/");
  return ddmmyyyy[2] != currYear;
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

///////////////////////////////////////////////////////////////////////////////
function cellIsCorrupted(newCell) {
  const hms = newCell.x.split(":");
  return (hms[1] != "00" && hms[1] != "30") || hms[2] != "00";
}

////////////////////////////////////////////////////////////////////////////////
function isDate(str) {
  return str.match(/[0-9]*\/[0-9]*\/[0-9]*/);
}

////////////////////////////////////////////////////////////////////////////////
function deepCopy(arr) {
  return JSON.parse(JSON.stringify(arr));
}
