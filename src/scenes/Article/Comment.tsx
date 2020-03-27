import * as React from "react";

import { Link } from "react-router-dom";
import { IComment } from "../../stores/ArticleStore";
import { useStores } from "../../common/useStore";

interface ICommentProps {
  comment: IComment;
  onRemove: (id: number) => void;
}
const Comment: React.FC<ICommentProps> = ({ comment, onRemove }) => {
  // const store = useStores().articleStore;
  const authStore = useStores().authStore;

  return (
    <div className="card">
      <div className="card-block">
        <p className="card-text">{comment.body}</p>
      </div>
      <div className="card-footer">
        <Link to={`/@${comment.author.username}`} className="comment-author">
          <img src={comment.author.image} className="comment-author-img" alt="" />
        </Link>
        &nbsp;
        <Link to={`/@${comment.author.username}`} className="comment-author">
          {comment.author.username}
        </Link>
        <span className="date-posted">{new Date(comment.createdAt).toDateString()}</span>
        {authStore.currentUser?.username === comment.author.username && (
          <span className="mod-options">
            <i className="ion-trash-a" onClick={() => onRemove(comment.id)} />
          </span>
        )}
      </div>
    </div>
  );
};

export default Comment;
