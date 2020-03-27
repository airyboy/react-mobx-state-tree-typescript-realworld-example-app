import { types as t, flow, Instance } from "mobx-state-tree";
import { UserClient } from "../services/user.client";
import { ProfileResponse } from "../types/User";
import { authFetch } from "../common/auth.fetch";
import { Article, IArticle } from "./ArticleStore";
import { ConduitClient } from "../services/conduit.client";
import { ArticlesResponse } from "../types/Article";

const userClient = new UserClient("", { fetch: authFetch });
const conduitClient = new ConduitClient("", { fetch: authFetch });

export const Profile = t
  .model("Profile", {
    username: t.string,
    bio: t.maybeNull(t.string),
    image: t.maybeNull(t.string),
    following: t.boolean,
    favoriteArticles: t.optional(t.array(Article), []),
    ownArticles: t.optional(t.array(Article), [])
  })
  .actions(self => ({
    addFavorited(articles: IArticle[]) {
      self.favoriteArticles.push(...articles);
    },
    addCreated(articles: IArticle[]) {
      self.ownArticles.push(...articles);
    },
    resetArticles() {
      self.favoriteArticles.splice(0);
      self.ownArticles.splice(0);
    },
    toggleFollow() {
      self.following = !self.following;
    }
  }));

export const ProfileStore = t
  .model("ProfileStore", {
    currentProfile: t.maybe(Profile),
    totalFavorited: t.maybe(t.number),
    totalOwn: t.maybe(t.number)
  })
  .actions(self => {
    const loadProfile = flow(function*(username: string) {
      const profileResponse: ProfileResponse = yield userClient.getProfile(username);

      self.currentProfile = Profile.create(profileResponse.profile);
    });

    const loadArticles = flow(function*(type: "favorite" | "own", username: string, offset: number = 0) {
      self.currentProfile?.resetArticles();
      if (type === "own") {
        const articlesResponse: ArticlesResponse = yield conduitClient.listArticles(
          undefined,
          username,
          undefined,
          10,
          offset
        );

        self.totalOwn = articlesResponse.articlesCount;
        self.currentProfile?.addCreated(articlesResponse.articles.map(a => Article.create(a)));
      } else {
        const articlesResponse: ArticlesResponse = yield conduitClient.listArticles(
          undefined,
          undefined,
          username,
          10,
          offset
        );

        self.totalFavorited = articlesResponse.articlesCount;
        self.currentProfile?.addFavorited(articlesResponse.articles.map(a => Article.create(a)));
      }
    });

    const toggleFollow = flow(function*(profile: IProfile) {
      if (profile.following) {
        yield userClient.unfollowUser(profile.username);
      } else {
        yield userClient.followUser(profile.username);
      }

      profile.toggleFollow();
    });

    const reset = () => {
      self.currentProfile = undefined;
    };

    return { loadProfile, loadArticles, toggleFollow, reset };
  });

export interface IProfile extends Instance<typeof Profile> {}
