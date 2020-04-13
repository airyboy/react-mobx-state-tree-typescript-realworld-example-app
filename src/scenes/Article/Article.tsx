import * as React from "react";

import marked from "marked";

import { useStores } from "../../common/useStore";
import { useRouteMatch } from "react-router";

import Spinner from "../../components/Spinner";
import { observer } from "mobx-react-lite";
import ArticleMeta from "./ArticleMeta";
import Comment from "./Comment";
import AddComment from "./AddComment";
import { Link } from "react-router-dom";

const Article: React.FC<{}> = () => {
  const { isLoggedIn } = useStores();

  const store = useStores().articleStore;
  const match = useRouteMatch();

  const [isLoading, setIsLoading] = React.useState(false);

  React.useLayoutEffect(() => {
    return () => {
      store.resetCurrents();
    };
  }, [store]);

  React.useEffect(() => {
    const slug = (match.params as any).slug;
    const load = async () => {
      setIsLoading(true);
      await store.loadArticle(slug);
      await store.loadArticleComments(slug);
      setIsLoading(false);
    };
    load();
  }, [store, match.params]);

  const handleCommentRemoval = (id: number) => {
    store.deleteComment(store.currentArticle!.slug, id);
  };

  const markdown = React.useMemo(() => {
    if (store.currentArticle) {
      return { __html: marked(store.currentArticle!.body, { sanitize: true }) };
    }
  }, [store.currentArticle]);

  return (
    <>
      <div className="article-page">
        <div className="banner" style={{ minHeight: "200px" }}>
          <div className="container">
            {store.currentArticle && (
              <>
                <h1>{store.currentArticle.title}</h1>
                <span className="date">{new Date(store.currentArticle.createdAt).toDateString()}</span>

                <ArticleMeta article={store.currentArticle} />
              </>
            )}
          </div>
        </div>
        {store.currentArticle && (
          <div className="container page">
            <div className="row article-content">
              <div className="col-xs-12">
                <div dangerouslySetInnerHTML={markdown}></div>

                <ul className="tag-list">
                  {store.currentArticle!.tagList.map(tag => {
                    return (
                      <li className="tag-default tag-pill tag-outline" key={tag}>
                        {tag}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
            <hr />
            {!isLoggedIn && (
              <div className="col-xs-12 col-md-8 offset-md-2">
                <p>
                  <Link to="/login">Sign in</Link>
                  &nbsp;or&nbsp;
                  <Link to="/register">sign up</Link>
                  &nbsp;to add comments on this article.
                </p>
              </div>
            )}
            <div className="row">
              {isLoading && (
                <div className="container">
                  <Spinner />
                </div>
              )}
            </div>
            <div className="row">
              <div className="col-xs-12 col-md-8 offset-md-2">
                {store.currentArticle.comments.map(comment => (
                  <Comment key={comment.id} comment={comment} onRemove={handleCommentRemoval} />
                ))}
              </div>
            </div>
            {isLoggedIn && (
              <div className="row">
                <div className="col-xs-12 col-md-8 offset-md-2">
                  <AddComment article={store.currentArticle} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default observer(Article);
