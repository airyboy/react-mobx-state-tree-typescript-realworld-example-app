/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";

import { useQuery } from "./useQuery";
import { useLocation } from "react-router";

export function useUrlPage() {
  const query = useQuery();
  const location = useLocation();

  const [page, setPage] = useState<number>(1);

  React.useEffect(() => {
    const page = query.get("page");
    setPage(page ? +page : 1);
  }, [location.search]);

  return page;
}
