import { UserResponse, ProfileResponse } from "../types/User";
import { DEFAULT_POST_HEADERS, DEFAULT_HEADERS } from "./default.headers";

export class UserClient {
  private http: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> };
  private baseUrl: string;
  protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

  constructor(baseUrl?: string, http?: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> }) {
    this.http = http ? http : (window as any);
    this.baseUrl = baseUrl ? baseUrl : "";
  }

  async login(email: string, password: string) {
    let url = this.baseUrl + "/api/users/login";

    let options = {
      method: "POST",
      headers: DEFAULT_POST_HEADERS,
      body: JSON.stringify({
        user: {
          email,
          password
        }
      })
    } as RequestInit;

    const response = await fetch(url, options);

    return this.processResponse<UserResponse>(response);
  }

  async register(email: string, username: string, password: string) {
    const url = this.baseUrl + `/api/users`;

    let options = {
      method: "POST",
      headers: DEFAULT_POST_HEADERS,
      body: JSON.stringify({
        user: {
          email,
          password,
          username
        }
      })
    } as RequestInit;

    const response = await fetch(url, options);

    return this.processResponse<UserResponse>(response);
  }

  async getCurrentUser() {
    const url = this.baseUrl + `/api/user`;

    let options = {
      headers: DEFAULT_POST_HEADERS
    } as RequestInit;

    const response = await this.http.fetch(url, options);

    return this.processResponse<UserResponse>(response);
  }

  async followUser(username: string) {
    const url = this.baseUrl + `/api/profiles/${username}/follow`;

    let options = {
      method: "POST",
      headers: DEFAULT_POST_HEADERS
    } as RequestInit;

    const response = await this.http.fetch(url, options);

    return this.processResponse<ProfileResponse>(response);
  }

  async unfollowUser(username: string) {
    const url = this.baseUrl + `/api/profiles/${username}/follow`;

    let options = {
      method: "DELETE",
      headers: DEFAULT_HEADERS
    } as RequestInit;

    const response = await this.http.fetch(url, options);

    return this.processResponse<ProfileResponse>(response);
  }

  async getProfile(username: string) {
    const url = this.baseUrl + `/api/profiles/${encodeURIComponent(username)}`;

    let options = {
      headers: DEFAULT_HEADERS
    } as RequestInit;

    const response = await this.http.fetch(url, options);

    return this.processResponse<ProfileResponse>(response);
  }

  async updateUser(email?: string, bio?: string, image?: string, username?: string, password?: string) {
    const url = this.baseUrl + `/api/user`;

    const payload = {
      email,
      bio,
      image,
      username,
      password
    };

    let options = {
      method: "PUT",
      headers: DEFAULT_POST_HEADERS,
      body: JSON.stringify({ user: payload })
    } as RequestInit;

    const response = await this.http.fetch(url, options);

    return this.processResponse<UserResponse>(response);
  }

  private async processResponse<T>(response: Response) {
    const status = response.status;

    if (status === 200) {
      const json = (await response.json()) as T;

      return json;
    }
  }
}
