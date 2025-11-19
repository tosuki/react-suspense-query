# React Fetching (Suspense API, fetch hooks)
This repository is a minimal playground to learn how to implement data-fetching hooks and the React Suspense pattern.

Goals
- Implement a conventional async hook: [`useQuery`](src/useQuery.ts) — see implementation in [`src/useQuery.ts`](src/useQuery.ts).
- Implement a Suspense-ready hook: [`useSuspenseQuery`](src/useSuspenseQuery.ts) — placeholder at [`src/useSuspenseQuery.ts`](src/useSuspenseQuery.ts).
- Experiment with using the hook from [`App`](src/App.tsx) — see [`src/App.tsx`](src/App.tsx).


Why these hooks?
- [`useQuery`](src/useQuery.ts) demonstrates a straightforward useEffect + state approach to fetch data.
- [`useSuspenseQuery`](src/useSuspenseQuery.ts) should demonstrate how to return a resource that either returns data or throws a promise/error so that React's Suspense and error boundaries can coordinate rendering.

Where to look
- Hook implementations:
  - [`useQuery`](src/useQuery.ts) — current non-suspense implementation.
  - [`useSuspenseQuery`](src/useSuspenseQuery.ts) — the hook you should implement.
- App entrypoints:
  - [`src/App.tsx`](src/App.tsx) — example usage.
  - [`src/main.tsx`](src/main.tsx) — app bootstrap.


How to run
   ```sh
   npm install
   npm run dev
  ```