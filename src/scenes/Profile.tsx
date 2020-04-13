/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";

import { useRouteMatch, useLocation } from "react-router";
import { useStores } from "../common/useStore";
import { observer } from "mobx-react-lite";
import TabButton from "../components/TabButton";
import ArticlePreview from "../components/ArticlePreview";
import Spinner from "../components/Spinner";
import Pager from "../components/Pager";
import { useUrlPage } from "../common/useUrlPage";
import { Link } from "react-router-dom";
import ArticleList from "../components/ArticleList";

interface IProfileMatchParams {
  username: string;
}

type ProfileMode = "own" | "favorite";

const Profile: React.FC<{}> = () => {
  const match = useRouteMatch();
  const location = useLocation();
  const store = useStores().profileStore;
  const authStore = useStores().authStore;

  const [profileMode, setProfileMode] = React.useState<ProfileMode>("own");
  const [isLoading, setIsLoading] = React.useState(true);

  const page = useUrlPage();

  React.useEffect(() => {
    const username = (match.params as IProfileMatchParams).username;

    const theProfileMode = match.path.indexOf("favorites") > -1 ? "favorite" : "own";
    setProfileMode(theProfileMode);

    const load = async () => {
      setIsLoading(true);

      if (!store.currentProfile || username !== store.currentProfile?.username) {
        await store.loadProfile(username);
      }
      const offset = (page - 1) * 10;
      await store.loadArticles(theProfileMode, username, offset);

      setIsLoading(false);
    };

    load();
  }, [location.pathname, page]);

  React.useEffect(() => {
    return () => {
      store.reset();
    };
  }, []);

  const isCurrentUser = React.useMemo(() => {
    return (match.params as IProfileMatchParams).username === authStore.currentUser?.username;
  }, [match.params, authStore.currentUser]);

  const toggleFollow = () => {
    store.toggleFollow(store.currentProfile!);
  };

  return (
    <div className="profile-page">
      <div className="user-info">
        <div className="container">
          <div className="row">
            {store.currentProfile && (
              <div className="col-xs-12 col-md-10 offset-md-1">
                <img src={store.currentProfile.image ?? ""} className="user-img" alt={store.currentProfile.username} />
                <h4>{store.currentProfile.username}</h4>
                <p>{store.currentProfile.bio}</p>

                {isCurrentUser && <EditProfileButton />}
                {!isCurrentUser && (
                  <FollowButton
                    username={store.currentProfile.username}
                    following={store.currentProfile.following}
                    onToggleFollow={toggleFollow}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-10 offset-md-1">
            {!isLoading && (
              <ul className="nav nav-pills outline-active">
                <TabButton
                  url={`/user/${(match.params as IProfileMatchParams).username}`}
                  isActive={profileMode === "own"}
                >
                  {isCurrentUser ? "My" : store.currentProfile!.username + "'s"} articles
                </TabButton>
                <TabButton
                  url={`/user/${(match.params as IProfileMatchParams).username}/favorites`}
                  isActive={profileMode === "favorite"}
                >
                  Favorited articles
                </TabButton>
              </ul>
            )}
            {isLoading && <Spinner />}

            {!isLoading &&
              (profileMode === "own"
                ? store.currentProfile?.ownArticles
                : store.currentProfile?.favoriteArticles
              )?.map(article => <ArticlePreview key={article.slug} article={article} />)}
            {!isLoading && (
              <ArticleList
                articles={
                  profileMode === "own" ? store.currentProfile?.ownArticles : store.currentProfile?.favoriteArticles
                }
              />
            )}
          </div>
        </div>
        <div className="row">
          <div className="col-xs-12 col-md-10 offset-md-1">
            {profileMode === "own" && (
              <Pager
                total={store.totalOwn}
                currentPage={page}
                pathname={`/user/${(match.params as IProfileMatchParams).username}`}
                searchParams={{ page }}
              />
            )}
            {profileMode === "favorite" && (
              <Pager
                total={store.totalFavorited}
                currentPage={page}
                pathname={`/user/${(match.params as IProfileMatchParams).username}/favorites`}
                searchParams={{ page }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

function EditProfileButton() {
  return (
    <Link to="/settings" className="btn btn-sm btn-outline-secondary action-btn">
      <i className="ion-gear-a" /> Edit Profile Settings
    </Link>
  );
}

function FollowButton({
  username,
  following,
  onToggleFollow
}: {
  username: string;
  following: boolean;
  onToggleFollow: () => void;
}) {
  return (
    <button
      className={"btn btn-sm action-btn " + (following ? "btn-secondary" : "btn-outline-secondary")}
      onClick={onToggleFollow}
    >
      <i className="ion-plus-round" />
      &nbsp;
      {following ? "Unfollow" : "Follow"} {username}
    </button>
  );
}

export default observer(Profile);
