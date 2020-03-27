import * as React from "react";

import { Link } from "react-router-dom";
import { observer } from "mobx-react-lite";

const PAGE_SIZE = 10;

type KeyValuePairs = { [key: string]: string | number | undefined };

interface IPagerProps {
  currentPage?: number;
  total: number | undefined;
  pathname: string;
  searchParams?: KeyValuePairs;
}

const Pager: React.FC<IPagerProps> = ({ total, pathname, searchParams, currentPage = 1 }) => {
  const pageNums = React.useMemo(() => {
    if (!total || total <= PAGE_SIZE) return [];

    const totalPages = Math.ceil(total / PAGE_SIZE);
    const pages = [];

    for (let i = 1; i <= totalPages; i++) pages.push(i);

    return pages;
  }, [total]);

  return (
    <nav>
      <ul className="pagination">
        {pageNums.map(p => (
          <li key={p} className={"page-item" + (currentPage === p ? " active" : "")}>
            <Link
              className="page-link"
              style={{ minWidth: 44, textAlign: "center" }}
              to={{ pathname, search: joinParams({ ...searchParams!, page: p }) }}
            >
              {p}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

function joinParams(params: KeyValuePairs) {
  let arr: string[] = [];

  for (let key in params) {
    if (params[key]) {
      arr.push(`${key}=${params[key]}`);
    }
  }

  return arr.join("&");
}

export default observer(Pager);
