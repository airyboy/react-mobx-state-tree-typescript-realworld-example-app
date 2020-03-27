import * as React from "react";

import { IArticle } from "../../stores/ArticleStore";
import { Link, useHistory } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useStores } from "../../common/useStore";

interface IArticleProps {
  article: IArticle;
}

const ArticleMeta: React.FC<IArticleProps> = ({ article }) => {
  const store = useStores().articleStore;
  const authStore = useStores().authStore;

  const history = useHistory();

  const handleDelete = async () => {
    await store.deleteArticle(article.slug);
    history.replace("/");
  };

  const canModify = React.useMemo(() => {
    return article.author.username === authStore.currentUser?.username;
  }, [article.author.username, authStore.currentUser]);

  return (
    <div className="article-meta">
      <Link to={`/${article.author.username}`}>
        <img src={article.author.image} alt="" />
      </Link>

      <div className="info">
        <Link to={`/user/${article.author.username}`} className="author">
          {article.author.username}
        </Link>
      </div>

      {canModify && (
        <span>
          <Link to={`/edit/${article.slug}`} className="btn btn-outline-secondary btn-sm">
            <i className="ion-edit" /> Edit Article
          </Link>
          &nbsp;
          <button className="btn btn-outline-danger btn-sm" onClick={handleDelete}>
            <i className="ion-trash-a" /> Delete Article
          </button>
        </span>
      )}
    </div>
  );
};

export default observer(ArticleMeta);
