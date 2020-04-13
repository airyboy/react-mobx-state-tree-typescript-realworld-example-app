import * as React from "react";
import { IArticle } from "../stores/ArticleStore";
import ArticlePreview from "./ArticlePreview";
import { observer } from "mobx-react-lite";

interface IArticleListProps {
  articles: IArticle[] | undefined;
}

const ArticleList: React.FC<IArticleListProps> = ({ articles }) => {
  if (!articles || !articles.length) {
    return <div className="article-preview">No articles are here... yet.</div>;
  } else {
    return (
      <>
        {articles.map(article => (
          <ArticlePreview key={article.slug} article={article} />
        ))}
      </>
    );
  }
};

export default observer(ArticleList);
