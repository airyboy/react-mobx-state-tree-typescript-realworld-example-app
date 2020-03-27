import { TagsResponse } from "../types/TagsResponse";
import { ArticlesResponse, ArticleResponse } from "../types/Article";
import { CommentsResponse, CommentResponse } from "../types/Comment";
import { DEFAULT_HEADERS, DEFAULT_POST_HEADERS } from "./default.headers";

export class ConduitClient {
  private http: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> };
  private baseUrl: string;
  protected jsonParseReviver: ((key: string, value: any) => any) | undefined = undefined;

  constructor(baseUrl?: string, http?: { fetch(url: RequestInfo, init?: RequestInit): Promise<Response> }) {
    this.http = http ? http : (window as any);
    this.baseUrl = baseUrl ? baseUrl : "";
  }

  async listArticles(tag?: string, author?: string, favorited?: string, limit: number = 10, offset?: number) {
    let url = this.baseUrl + "/api/articles?";

    if (tag !== undefined) url += "tag=" + encodeURIComponent("" + tag) + "&";
    if (author !== undefined) url += "author=" + encodeURIComponent("" + author) + "&";
    if (favorited !== undefined) url += "favorited=" + encodeURIComponent("" + favorited) + "&";
    if (limit !== undefined) url += "limit=" + limit + "&";
    if (offset !== undefined) url += "offset=" + offset + "&";
    url = url.replace(/[?&]$/, "");

    let options = {
      method: "GET",
      headers: {
        Accept: "application/json; charset=utf-8"
      }
    } as RequestInit;

    const response = await this.http.fetch(url, options);

    return this.processResponse<ArticlesResponse>(response);
  }

  async feedArticles() {
    let url = this.baseUrl + "/api/articles/feed";

    let options = {
      method: "GET",
      headers: {
        Accept: "application/json; charset=utf-8"
      }
    } as RequestInit;

    const response = await this.http.fetch(url, options);

    return this.processResponse<ArticlesResponse>(response);
  }

  async getArticle(slug: string) {
    const url = this.baseUrl + `/api/articles/${slug}`;

    let options = {
      method: "GET",
      headers: DEFAULT_HEADERS
    } as RequestInit;

    const response = await this.http.fetch(url, options);

    return this.processResponse<ArticleResponse>(response);
  }

  async getArticleComments(slug: string) {
    const url = this.baseUrl + `/api/articles/${slug}/comments`;

    let options = {
      method: "GET",
      headers: DEFAULT_HEADERS
    } as RequestInit;

    const response = await this.http.fetch(url, options);

    return this.processResponse<CommentsResponse>(response);
  }

  async createArticle(title: string, description: string, body: string, tagList?: string[]) {
    const url = this.baseUrl + `/api/articles`;

    const requestBody = {
      title,
      description,
      body,
      tagList
    };

    let options = {
      method: "POST",
      headers: DEFAULT_POST_HEADERS,
      body: JSON.stringify(requestBody)
    } as RequestInit;

    const response = await this.http.fetch(url, options);

    return this.processResponse<ArticleResponse>(response);
  }

  async updateArticle(slug: string, title?: string, description?: string, body?: string) {
    const url = this.baseUrl + `/api/articles/${slug}`;

    const requestBody = {
      title,
      description,
      body
    };

    let options = {
      method: "PUT",
      headers: { ...DEFAULT_HEADERS, "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    } as RequestInit;

    const response = await this.http.fetch(url, options);

    return this.processResponse<ArticleResponse>(response);
  }

  async deleteArticle(slug: string) {
    const url = this.baseUrl + `/api/articles/${slug}`;

    let options = {
      method: "DELETE",
      headers: DEFAULT_POST_HEADERS
    } as RequestInit;

    const response = await this.http.fetch(url, options);

    return this.processResponse<void>(response);
  }

  async favoriteArticle(slug: string) {
    const url = this.baseUrl + `/api/articles/${slug}/favorite`;

    let options = {
      method: "POST",
      headers: DEFAULT_HEADERS
    } as RequestInit;

    const response = await this.http.fetch(url, options);

    return this.processResponse<void>(response);
  }

  async unfavoriteArticle(slug: string) {
    const url = this.baseUrl + `/api/articles/${slug}/favorite`;

    let options = {
      method: "DELETE",
      headers: DEFAULT_HEADERS
    } as RequestInit;

    const response = await this.http.fetch(url, options);

    return this.processResponse<void>(response);
  }

  async postComment(slug: string, body: string) {
    const url = this.baseUrl + `/api/articles/${slug}/comments`;

    let options = {
      method: "POST",
      headers: DEFAULT_POST_HEADERS,
      body: JSON.stringify({
        comment: { body }
      })
    } as RequestInit;

    const response = await this.http.fetch(url, options);

    return this.processResponse<CommentResponse>(response);
  }

  async deleteComment(slug: string, id: number) {
    const url = this.baseUrl + `/api/articles/${slug}/comments/${id}`;

    let options = {
      method: "DELETE",
      headers: DEFAULT_POST_HEADERS
    } as RequestInit;

    const response = await this.http.fetch(url, options);

    return this.processResponse<void>(response);
  }

  async listTags() {
    const url = this.baseUrl + `/api/tags`;

    let options = {
      method: "GET",
      headers: DEFAULT_HEADERS
    } as RequestInit;

    const response = await this.http.fetch(url, options);

    return this.processResponse<TagsResponse>(response);
  }

  private async processResponse<T>(response: Response) {
    const status = response.status;

    if (status === 200) {
      const json = (await response.json()) as T;

      return json;
    }
  }
}
