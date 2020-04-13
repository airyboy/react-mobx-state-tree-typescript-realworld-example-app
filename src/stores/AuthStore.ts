import { types as t, flow, Instance } from "mobx-state-tree";
import { UserClient } from "../services/user.client";
import { UserResponse } from "../types/User";
import { authFetch } from "../common/auth.fetch";
import { persistToken, eraseToken } from "../common/auth.storage";

const userClient = new UserClient("", { fetch: authFetch });

export const User = t.model("User", {
  email: t.string,
  username: t.string,
  bio: t.maybeNull(t.string),
  image: t.maybeNull(t.string)
});

export const AuthStore = t
  .model("AuthStore", {
    currentUser: t.maybe(User)
  })
  .actions(self => {
    const login = flow(function*(email: string, password: string) {
      const userResponse: UserResponse = yield userClient.login(email, password);

      persistToken(userResponse.user.token);

      self.currentUser = userResponse.user;
    });

    const register = flow(function*(username: string, email: string, password: string) {
      const userResponse: UserResponse = yield userClient.register(email, username, password);

      persistToken(userResponse.user.token);

      self.currentUser = userResponse.user;
    });

    const getCurrentUser = flow(function*() {
      const userResponse: UserResponse = yield userClient.getCurrentUser();

      if (userResponse) {
        self.currentUser = userResponse.user;
      }
    });

    const updateUser = flow(function*(
      email?: string,
      bio?: string,
      image?: string,
      username?: string,
      password?: string
    ) {
      const userResponse: UserResponse = yield userClient.updateUser(email, bio, image, username, password);

      self.currentUser = userResponse.user;
    });

    const logout = () => {
      eraseToken();
      self.currentUser = undefined;
    };

    return { login, logout, register, getCurrentUser, updateUser };
  });

export interface IUser extends Instance<typeof User> {}
