import * as React from "react";
import { useStores } from "../common/useStore";
import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";

const Tags: React.FC<{}> = () => {
  const store = useStores().articleStore;

  return (
    <div className="tag-list">
      {store.tags.map(tag => (
        <Link key={tag} className="tag-default tag-pill" to={`/?tag=${encodeURIComponent(tag)}`}>
          {tag}
        </Link>
      ))}
    </div>
  );
};

export default observer(Tags);
