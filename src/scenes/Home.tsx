/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";

import { observer } from "mobx-react-lite";

import { useStores } from "../common/useStore";
import ArticlePreview from "../components/ArticlePreview";
import Banner from "../components/Banner";
import Tags from "../components/Tags";
import Spinner from "../components/Spinner";

import { Link, useLocation } from "react-router-dom";
import Pager from "../components/Pager";
import { useQuery } from "../common/useQuery";
import ArticleList from "../components/ArticleList";

type TabType = "all" | "feed" | "tag";

const Home: React.FC<{}> = () => {
  const store = useStores().articleStore;

  const location = useLocation();

  const query = useQuery();

  const [tabType, setTabType] = React.useState<TabType>("all");
  const [tag, setTag] = React.useState<string | undefined>(undefined);
  const [page, setPage] = React.useState<number | undefined>();

  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const page = query.get("page");
    setPage(page ? +page : undefined);

    const tabParam = query.get("tab");

    if (["all", "feed"].includes(tabParam ?? "")) {
      setTabType(tabParam as TabType);
      setTag("");
      return;
    }

    const tagParam = query.get("tag");
    if (tagParam) {
      setTabType("tag");
      setTag(tagParam);
      return;
    }

    setTabType("all");
  }, [location.search]);

  React.useEffect(() => {
    let offset: number | undefined;
    if (page) {
      offset = (+page - 1) * 10;
    }

    const load = async () => {
      store.loadTags();

      setIsLoading(true);

      if (tabType === "all") {
        await store.loadArticles(undefined, undefined, undefined, 10, offset);
      } else if (tabType === "feed") {
        await store.loadFeed();
      } else if (tabType === "tag") {
        await store.loadArticles(tag, undefined, undefined, 10, offset);
      }
      setIsLoading(false);
    };
    load();
  }, [tabType, page]);

  React.useEffect(() => {
    return () => {
      store.resetCurrents();
    };
  }, [store]);

  return (
    <div className="home-page">
      <Banner />
      <div className="container">
        <div className="row">
          <div className="col-md-9">
            <ul className="nav nav-pills outline-active">
              <Tab url="/?tab=all" isActive={tabType === "all"}>
                Global Feed
              </Tab>
              <Tab url="/?tab=feed" isActive={tabType === "feed"}>
                Your Feed
              </Tab>
              {tag && (
                <Tab url={`/?tag=${tag}`} isActive={tabType === "tag"}>
                  <i className="ion-pound" />
                  {tag}
                </Tab>
              )}
            </ul>

            {isLoading && <Spinner />}
            {!isLoading && <ArticleList articles={store.articles} />}
          </div>

          <div className="col-md-3">
            <div className="sidebar">
              <p>Popular Tags</p>
              <Tags />
            </div>
          </div>
        </div>

        {tabType !== "feed" && !isLoading && (
          <div className="row">
            <div className="col-md-9">
              <Pager total={store.totalArticles} pathname="/" searchParams={{ tag }} currentPage={page} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function Tab({ children, isActive, url }: { children: React.ReactNode; isActive: boolean; url: string }) {
  return (
    <li className="nav-item">
      <Link className={"nav-link " + (isActive ? "active" : "")} to={url}>
        {children}
      </Link>
    </li>
  );
}

Home.displayName = "Home";

export default observer(Home);
