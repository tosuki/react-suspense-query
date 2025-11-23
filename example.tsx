import React, { useState, Suspense } from "react";

// -----------------------------------------------------------------------------
// 1. SIMPLE CACHE IMPLEMENTATION
// -----------------------------------------------------------------------------
// In a real app, this might be a Context or a library like TanStack Query.
// We need this because React components re-render. If we don't cache the
// promise, we will create a new fetch request on every render, causing an infinite loop.

const cache = new Map();

function getSuspenseResource(path) {
  // If we haven't seen this path before, start fetching
  if (!cache.has(path)) {
    const promise = fetch(path)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // Add artificial delay to make the spinner visible for the demo
        return new Promise((resolve) => setTimeout(() => resolve(data), 1500));
      })
      .then((data) => {
        cache.set(path, { status: "success", data });
      })
      .catch((error) => {
        cache.set(path, { status: "error", error });
      });

    // Store the pending promise
    cache.set(path, { status: "pending", promise });
  }

  // Get the current state of this request
  const entry = cache.get(path);

  // THE MAGIC:
  // 1. If pending, THROW the promise (React Suspense catches this).
  // 2. If error, THROW the error (ErrorBoundary catches this).
  // 3. If success, RETURN the data.
  if (entry.status === "pending") {
    throw entry.promise;
  }
  if (entry.status === "error") {
    throw entry.error;
  }

  return entry.data;
}

// -----------------------------------------------------------------------------
// 2. THE CUSTOM HOOK
// -----------------------------------------------------------------------------
function useSuspenseQuery(path) {
  // This looks synchronous, but it will pause execution if data isn't ready
  return getSuspenseResource(path);
}

// -----------------------------------------------------------------------------
// 3. ERROR BOUNDARY (Required for Suspense Data Fetching)
// -----------------------------------------------------------------------------
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center">
          <h3 className="font-bold mb-2">Something went wrong</h3>
          <p>{this.state.error.message}</p>
          <button
            onClick={() => {
              // simple reset for demo
              this.setState({ hasError: false });
              window.location.reload();
            }}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// -----------------------------------------------------------------------------
// 4. COMPONENTS
// -----------------------------------------------------------------------------

// This component reads data "synchronously". No useEffect, no if(loading) checks.
const UserProfile = ({ userId }) => {
  const data = useSuspenseQuery(
    `https://jsonplaceholder.typicode.com/users/${userId}`,
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 animate-in fade-in zoom-in duration-300">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
          {data.name.charAt(0)}
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{data.name}</h2>
          <p className="text-slate-500">@{data.username}</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3 text-slate-600">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            ></path>
          </svg>
          {data.email}
        </div>
        <div className="flex items-center gap-3 text-slate-600">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            ></path>
          </svg>
          {data.phone}
        </div>
        <div className="flex items-center gap-3 text-slate-600">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
            ></path>
          </svg>
          {data.website}
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-slate-100">
        <h3 className="font-semibold text-slate-700 mb-2">Company</h3>
        <p className="text-slate-600 text-sm italic">
          "{data.company.catchPhrase}"
        </p>
      </div>
    </div>
  );
};

const LoadingFallback = () => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
    <div className="flex items-center gap-4 mb-4">
      <div className="w-16 h-16 bg-slate-200 rounded-full animate-pulse"></div>
      <div className="space-y-2">
        <div className="h-6 w-48 bg-slate-200 rounded animate-pulse"></div>
        <div className="h-4 w-24 bg-slate-200 rounded animate-pulse"></div>
      </div>
    </div>
    <div className="space-y-3">
      <div className="h-4 w-full bg-slate-200 rounded animate-pulse"></div>
      <div className="h-4 w-3/4 bg-slate-200 rounded animate-pulse"></div>
      <div className="h-4 w-5/6 bg-slate-200 rounded animate-pulse"></div>
    </div>
  </div>
);

// -----------------------------------------------------------------------------
// 5. MAIN APP
// -----------------------------------------------------------------------------
export default function App() {
  const [currentId, setCurrentId] = useState(1);
  // We use a key on Suspense to force a reset when the ID changes
  // This ensures the fallback is shown again for the new data

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-800">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">
            Suspense Fetching
          </h1>
          <p className="text-slate-500">
            Render-as-you-fetch pattern demonstration
          </p>
        </div>

        {/* CONTROLS */}
        <div className="flex justify-center gap-2 p-1 bg-white rounded-lg shadow-sm border border-slate-200">
          {[1, 2, 3, 4, 999].map((id) => (
            <button
              key={id}
              onClick={() => setCurrentId(id)}
              className={`px-4 py-2 rounded-md transition-all text-sm font-medium ${
                currentId === id
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {id === 999 ? "Error Test" : `User ${id}`}
            </button>
          ))}
        </div>

        {/* THE SUSPENSE BOUNDARY */}
        {/* We use an ErrorBoundary OUTSIDE the Suspense boundary */}
        <ErrorBoundary key={currentId}>
          <Suspense fallback={<LoadingFallback />}>
            <UserProfile userId={currentId} />
          </Suspense>
        </ErrorBoundary>

        <div className="text-xs text-slate-400 text-center px-8">
          Note: I added a 1.5s artificial delay to the fetch so you can clearly
          see the Suspense fallback skeleton.
        </div>
      </div>
    </div>
  );
}
