import * as React from "react";
import { useStores } from "../../common/useStore";
import { IArticle } from "../../stores/ArticleStore";

interface IAddCommentProps {
  article: IArticle;
}

const AddComment: React.FC<IAddCommentProps> = ({ article }) => {
  const store = useStores().articleStore;
  const authStore = useStores().authStore;

  const [body, setBody] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = React.useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      setIsLoading(true);
      await store.addComment(article.slug, body);
      setIsLoading(false);
      setBody("");
    },
    [article.slug, body, store]
  );

  return (
    <form className="card comment-form" onSubmit={handleSubmit}>
      <div className="card-block">
        <textarea
          className="form-control"
          placeholder="Write a comment..."
          value={body}
          disabled={isLoading}
          onChange={e => setBody(e.target.value)}
          rows={3}
        />
      </div>
      <div className="card-footer">
        <img src={authStore.currentUser!.image!} className="comment-author-img" alt="" />
        <button className="btn btn-sm btn-primary" type="submit">
          Post Comment
        </button>
      </div>
    </form>
  );
};

export default AddComment;
