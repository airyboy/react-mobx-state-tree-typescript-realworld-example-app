import * as React from "react";
import { Link } from "react-router-dom";
import { IArticle } from "../stores/ArticleStore";
import { useStores } from "../common/useStore";
import { observer } from "mobx-react-lite";

interface IArticlePreviewProps {
  article: IArticle;
}

const ArticlePreview: React.FC<IArticlePreviewProps> = ({ article }) => {
  const rootStore = useStores();
  const store = useStores().articleStore;

  const favoriteButtonClass = React.useMemo(() => {
    return article.favorited ? "btn btn-sm btn-primary" : "btn btn-sm btn-outline-primary";
  }, [article.favorited]);

  return (
    <div className="article-preview">
      <div className="article-meta">
        <Link to={`/${article.author.username}`}>
          <img
            src={article.author.image || "https://static.productionready.io/images/smiley-cyrus.jpg"}
            alt={article.author.username}
          />
        </Link>

        <div className="info">
          <Link className="author" to={`/user/${article.author.username}`}>
            {article.author.username}
          </Link>
          <span className="date">{new Date(article.createdAt).toDateString()}</span>
        </div>

        <div className="pull-xs-right">
          <button
            className={favoriteButtonClass}
            style={!rootStore.isLoggedIn ? { cursor: "not-allowed", pointerEvents: "none" } : {}}
            onClick={() => store.toggleFavorite(article)}
          >
            <i className="ion-heart"></i> {article.favoritesCount}
          </button>
        </div>
      </div>

      <Link to={`/article/${article.slug}`} className="preview-link">
        <h1>{article.title}</h1>
        <p>{article.description}</p>
        <span>Read more...</span>
        <ul className="tag-list">
          {article.tagList.map(tag => {
            return (
              <li className="tag-default tag-pill tag-outline" key={tag}>
                {tag}
              </li>
            );
          })}
        </ul>
      </Link>
    </div>
  );
};

export default observer(ArticlePreview);
