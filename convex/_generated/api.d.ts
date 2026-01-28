/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as bookmarks from "../bookmarks.js";
import type * as clerk from "../clerk.js";
import type * as exams from "../exams.js";
import type * as files from "../files.js";
import type * as migrations from "../migrations.js";
import type * as questions from "../questions.js";
import type * as seedExams from "../seedExams.js";
import type * as seedScfhsExams from "../seedScfhsExams.js";
import type * as subjects from "../subjects.js";
import type * as updateExamAbbreviations from "../updateExamAbbreviations.js";
import type * as usageLimits from "../usageLimits.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  bookmarks: typeof bookmarks;
  clerk: typeof clerk;
  exams: typeof exams;
  files: typeof files;
  migrations: typeof migrations;
  questions: typeof questions;
  seedExams: typeof seedExams;
  seedScfhsExams: typeof seedScfhsExams;
  subjects: typeof subjects;
  updateExamAbbreviations: typeof updateExamAbbreviations;
  usageLimits: typeof usageLimits;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
