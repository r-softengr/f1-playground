/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";

interface ISeason {
  season: string;
  url: string;
}
interface ISeasonResponse {
  MRData: { SeasonTable: ISeasonTable; total: number };
}
interface ISeasonTable {
  Seasons: ISeason[];
}

const Season = () => {
  const [season, setSeason] = useState<ISeasonTable>();
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const limit = 30;
  const magicNumber = 1;

  const baseURL = "https://ergast.com/api/f1/seasons.json";
  useEffect(() => {
    const abortController = new AbortController();
    const getSeason = async () => {
      const response: AxiosResponse<ISeasonResponse> = await axios.get(
        `${baseURL}?limit=30&offset=${currentPage * limit}`
      );
      setSeason(response.data.MRData.SeasonTable);
      setTotalPage(Math.ceil(response.data.MRData.total / limit));
    };
    getSeason();
    return () => {
      abortController.abort();
    };
  }, [currentPage]);

  function nextPage(e: React.MouseEvent) {
    e.preventDefault();
    if (currentPage < totalPage) {
      setCurrentPage((prevPage) => prevPage + magicNumber);
    }
  }
  function prevPage(e: React.MouseEvent) {
    e.preventDefault();
    if (currentPage < totalPage) {
      setCurrentPage((prevPage) => prevPage - magicNumber);
    }
  }
  function firstPage(e: React.MouseEvent) {
    e.preventDefault();
    if (currentPage < totalPage) {
      setCurrentPage((prevPage: number) => (prevPage = 0));
    }
  }
  function lastPage(e: React.MouseEvent) {
    e.preventDefault();
    if (currentPage < totalPage) {
      setCurrentPage((prevPage: number) => (prevPage = totalPage));
    }
  }
  return (
    <>
      <div>
        <button onClick={(e) => firstPage(e)} disabled={currentPage === 0}>
          First Page
        </button>
        <button onClick={(e) => prevPage(e)} disabled={currentPage === 0}>
          Previous Page
        </button>
        <button
          onClick={(e) => nextPage(e)}
          disabled={currentPage + magicNumber >= totalPage}
        >
          Next Page
        </button>
        <button
          onClick={(e) => lastPage(e)}
          disabled={currentPage + magicNumber === totalPage}
        >
          Last Page
        </button>
        <h3>{`Page ${currentPage + magicNumber} of ${totalPage}`}</h3>
        <ul>
          {season?.Seasons.map((year) => {
            return (
              <li key={year.season}>
                <a href={`https://ergast.com/api/f1/${year.season}`}>
                  {year.season}-
                </a>
                <a href={year.url}>Wikipedia</a>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default Season;
