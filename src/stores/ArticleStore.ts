import { types as t, flow, Instance } from "mobx-state-tree";

import { ConduitClient } from "../services/conduit.client";

import { ArticlesResponse, ArticleResponse } from "../types/Article";
import { CommentsResponse, CommentResponse } from "../types/Comment";
import { authFetch } from "../common/auth.fetch";
import { TagsResponse } from "../types/TagsResponse";

const conduitClient = new ConduitClient("", { fetch: authFetch });

export const Comment = t.model("Comment", {
  id: t.number,
  createdAt: t.string,
  updatedAt: t.string,
  body: t.string,
  author: t.model({
    username: t.string,
    bio: t.maybeNull(t.string),
    image: t.string,
    following: t.boolean
  })
});

export const Article = t
  .model("Article", {
    slug: t.identifier,
    title: t.string,
    description: t.string,
    body: t.string,
    tagList: t.array(t.string),
    createdAt: t.string,
    updatedAt: t.string,
    favorited: t.boolean,
    favoritesCount: t.number,
    author: t.model({
      username: t.string,
      bio: t.maybeNull(t.string),
      image: t.string,
      following: t.boolean
    }),
    comments: t.optional(t.array(Comment), [])
  })
  .actions(self => {
    const addComment = (comment: IComment) => {
      self.comments.push(comment);
    };

    const removeComment = (id: number) => {
      const i = self.comments.findIndex(c => c.id === id);

      self.comments.splice(i, 1);
    };

    const resetComments = () => {
      self.comments.splice(0);
    };

    const toggleFavorite = () => {
      self.favoritesCount += self.favorited ? -1 : 1;
      self.favorited = !self.favorited;
    };

    return { addComment, removeComment, resetComments, toggleFavorite };
  });

export const ArticleStore = t
  .model("ArticleStore", {
    totalArticles: t.maybe(t.number),
    articles: t.optional(t.array(Article), []),
    currentArticle: t.maybe(t.reference(Article)),
    tags: t.optional(t.array(t.string), [])
  })
  .actions(self => {
    const loadArticles = flow(function*(
      tag?: string,
      author?: string,
      favorited?: string,
      limit?: number,
      offset?: number
    ) {
      self.articles.splice(0);
      const articlesResponse: ArticlesResponse = yield conduitClient.listArticles(
        tag,
        author,
        favorited,
        limit,
        offset
      );

      self.totalArticles = articlesResponse.articlesCount;
      articlesResponse.articles.forEach(article => self.articles.push(Article.create(article)));
    });

    const loadFeed = flow(function*() {
      self.articles.splice(0);

      const articlesResponse: ArticlesResponse = yield conduitClient.feedArticles();

      articlesResponse.articles.forEach(article => self.articles.push(Article.create(article)));
    });

    const loadArticle = flow(function*(slug: string) {
      const cachedArticle = self.articles.find(a => a.slug === slug);
      if (cachedArticle) {
        self.currentArticle = cachedArticle;
      } else {
        const articleResponse: ArticleResponse = yield conduitClient.getArticle(slug);

        const article = Article.create(articleResponse.article);
        self.articles.push(article);
        self.currentArticle = article;
      }
    });

    const loadTags = flow(function*() {
      const tagsResponse: TagsResponse = yield conduitClient.listTags();

      const newTags = tagsResponse.tags.filter(t => self.tags.indexOf(t) === -1);

      self.tags.push(...newTags);
    });

    const createArticle = flow(function*(title: string, description: string, body: string, tagList: string[]) {
      const articleResponse: ArticleResponse = yield conduitClient.createArticle(title, description, body, tagList);

      const article = Article.create(articleResponse.article);
      self.articles.unshift(article);

      return article;
    });

    const updateArticle = flow(function*(slug: string, title: string, description: string, body: string) {
      const articleResponse: ArticleResponse = yield conduitClient.updateArticle(slug, title, description, body);

      const article = Article.create(articleResponse.article);

      return article;
    });

    const deleteArticle = flow(function*(slug: string) {
      yield conduitClient.deleteArticle(slug);
    });

    const loadArticleComments = flow(function*(slug: string) {
      const article = self.articles.find(a => a.slug === slug);

      if (article) {
        article.resetComments();
        const commentsResponse: CommentsResponse = yield conduitClient.getArticleComments(slug);
        commentsResponse.comments.forEach(comment => {
          article.addComment(Comment.create(comment));
        });
      }
    });

    const addComment = flow(function*(slug: string, body: string) {
      const commentResponse: CommentResponse = yield conduitClient.postComment(slug, body);

      const article = self.articles.find(a => a.slug === slug);

      if (article) {
        article.addComment(Comment.create(commentResponse.comment));
      }
    });

    const deleteComment = flow(function*(slug: string, id: number) {
      yield conduitClient.deleteComment(slug, id);

      const article = self.articles.find(a => a.slug === slug);

      if (article) {
        article.removeComment(id);
      }
    });

    const toggleFavorite = flow(function*(article: IArticle) {
      if (article.favorited) {
        yield conduitClient.unfavoriteArticle(article.slug);
      } else {
        yield conduitClient.favoriteArticle(article.slug);
      }
      article.toggleFavorite();
    });

    const resetCurrents = () => {
      self.articles.splice(0);
      self.currentArticle = undefined;
    };

    return {
      createArticle,
      updateArticle,
      deleteArticle,
      loadArticles,
      loadArticle,
      loadArticleComments,
      loadTags,
      resetCurrents,
      addComment,
      deleteComment,
      loadFeed,
      toggleFavorite
    };
  });

export interface IArticle extends Instance<typeof Article> {}
export interface IComment extends Instance<typeof Comment> {}
