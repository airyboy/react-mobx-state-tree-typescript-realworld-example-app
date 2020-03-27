import { types as t, Instance } from "mobx-state-tree";
import { ArticleStore } from "./ArticleStore";
import { AuthStore } from "./AuthStore";
import { ProfileStore } from "./ProfileStore";

export const RootStore = t
  .model("RootStore", {
    articleStore: t.optional(ArticleStore, {
      articles: []
    }),
    authStore: t.optional(AuthStore, {
      currentUser: undefined
    }),
    profileStore: t.optional(ProfileStore, {
      currentProfile: undefined
    })
  })
  .actions(self => {
    const afterCreate = () => {
      self.authStore.getCurrentUser();
    };

    return { afterCreate };
  })
  .views(self => ({
    get isLoggedIn() {
      return self.authStore.currentUser !== undefined;
    }
  }));

export interface IStore extends Instance<typeof RootStore> {}
