/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import { useStores } from "../common/useStore";
import { useRouteMatch, useParams, useHistory } from "react-router";
import { IArticle } from "../stores/ArticleStore";

type EditorMode = "new" | "edit";

const PostEditor: React.FC<{}> = () => {
  const store = useStores().articleStore;

  const history = useHistory();

  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [body, setBody] = React.useState("");
  const [tag, setTag] = React.useState("");
  const [tagList, setTagList] = React.useState<string[]>([]);

  const [isLoading, setIsLoading] = React.useState(false);

  const match = useRouteMatch("/edit/:slug");
  const params = useParams();

  const editorMode = React.useMemo<EditorMode>(() => {
    return match ? "edit" : "new";
  }, [match]);

  React.useEffect(() => {
    const load = async () => {
      if (editorMode === "edit") {
        await store.loadArticle((params as any).slug);

        const currentArticle = store.currentArticle;
        setTitle(currentArticle!.title);
        setBody(currentArticle!.body);
        setDescription(currentArticle!.description);
        setTagList(currentArticle!.tagList);
      }
    };

    load();
  }, [editorMode]);

  const changeField = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const val = e.target.value;

    switch (e.target.name) {
      case "title":
        setTitle(val);
        break;
      case "description":
        setDescription(val);
        break;
      case "body":
        setBody(val);
        break;
      case "tag":
        setTag(val);
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    let article: IArticle;
    if (editorMode === "new") {
      article = await store.createArticle(title, description, body, []);
    } else {
      article = await store.updateArticle(store.currentArticle!.slug, title, description, body);
    }
    setIsLoading(false);
    history.push(`/article/${article.slug}`);
  };

  const handleTagKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (!tagList.includes(tag)) {
        setTagList(prev => [...prev, tag]);
      }
      setTag("");
    }
  };

  const removeTag = (tag: string) => {
    setTagList(prev => prev.filter(t => t !== tag));
  };

  return (
    <div className="editor-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-10 offset-md-1 col-xs-12">
            {/* <ListErrors errors={this.props.errors}></ListErrors> */}

            <form onSubmit={handleSubmit}>
              <fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="text"
                    placeholder="Article Title"
                    value={title}
                    name="title"
                    onChange={changeField}
                  />
                </fieldset>

                <fieldset className="form-group">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="What's this article about?"
                    value={description}
                    name="description"
                    onChange={changeField}
                  />
                </fieldset>

                <fieldset className="form-group">
                  <textarea
                    className="form-control"
                    rows={8}
                    placeholder="Write your article (in markdown)"
                    value={body}
                    name="body"
                    onChange={changeField}
                  ></textarea>
                </fieldset>

                <fieldset className="form-group">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Enter tag and press Enter"
                    value={tag}
                    name="tag"
                    onChange={changeField}
                    onKeyUp={handleTagKeyUp}
                  />

                  <div className="tag-list">
                    {(tagList || []).map(theTag => {
                      return (
                        <span className="tag-default tag-pill" key={theTag}>
                          <i className="ion-close-round" onClick={() => removeTag(theTag)}></i>
                          {theTag}
                        </span>
                      );
                    })}
                  </div>
                </fieldset>

                <button className="btn btn-lg pull-xs-right btn-primary" type="submit" disabled={isLoading}>
                  Publish Article
                </button>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostEditor;
