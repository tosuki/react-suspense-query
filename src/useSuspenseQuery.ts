import React from "react";

export type CachedRequest =
  | {
      status: "success";
      data: unknown;
      error?: never;
      promise?: Promise<unknown>;
    }
  | {
      status: "error";
      data?: never;
      error: unknown;
      promise?: Promise<unknown>;
    }
  | {
      status: "pending";
      data?: never;
      error?: never;
      promise: Promise<unknown>;
    };

/**
 * Path -> CachedRequest
 */
const cachedRequests = new Map<string, CachedRequest>();

export const getSuspenseResource = (path: string) => {
  if (!cachedRequests.has(path)) {
    const promise = fetch(path)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Request failed, response status: ${response.status}`,
          );
        }

        return response.json().then((data) => {
          setTimeout(() => {
            cachedRequests.set(path, {
              status: "success",
              data,
            });
          }, 3000);
        });
      })
      .catch((error) => {
        cachedRequests.set(path, {
          status: "error",
          error,
        });
      });
    cachedRequests.set(path, { status: "pending", promise });
  }

  const entry = cachedRequests.get(path);

  switch (entry!.status) {
    case "success":
      return entry!.data;
    case "error":
      throw entry!.error;
    case "pending":
      throw entry!.promise;
  }
};

export const useSuspenseQuery = (path: string) => {
  return getSuspenseResource(path);
};

export type ErrorBoundaryState =
  | { hasError: true; error: unknown }
  | { hasError: false; error?: never };

