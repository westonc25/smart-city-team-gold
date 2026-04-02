# Integration work (Tony) — status check & plan

**Source:** team `#tasks` list (Integration Work: Úlfr, Carlos, **Tony**) — merge backend and frontend for the prototype, integrate modules incrementally; forum/DB shape evolving with prototype demo location (Weston).

---

## 1. What the commit history already shows

| Area | On `main` (current `origin/main` tip: `03a9460`) |
|------|-----------------------------------------------|
| Forum feed → HTTP | **Partial.** Joshua: *“Connected forum Frontend to backend endpoint”* — `forum.tsx` calls `GET http://10.0.2.2:3000/forum/posts` and, if the response is an array, shows it in the feed. |
| Forum state / detail / create | **Mostly client-only.** Follow-up commits wired **ForumContext** for `addPost` / `addComment` and post detail — but context is still seeded from **`forumMockData`**, not from the API. |
| Backend in this repo | **`backend/src/index.ts` is still a minimal Elysia “Hello” app** — no `/forum` routes in the tree that `main` tracks. |
| Fuller backend + forum DB layer | **Exists on another branch** — e.g. `Nick`: *“Integrate forum API routes with database service”* touches `backend/src/modules/forum/` on **`origin/Westons-Backend-Workflow-Setup`** (not merged into `main` here). |

**Conclusion:** The task of the **begin merging backend and frontend** is **not fully done** on `main`. There is an initial **GET posts** hook in the app, but there is **no end-to-end prototype** on this branch: no forum API in the checked-in backend, brittle base URL, and **post detail / create / comments** are not backed by the same source as the feed.

---

## 2. Gaps in the current app (checked in the code)

1. **Single source of truth:** `ForumProvider` always initializes from mock data. The feed can show **API** posts while **post detail** resolves posts **only** from context → tapping an API-backed card can leave you on a stuck “Loading post…” state (ID not in context).
2. **Mutations:** `CreatePostModal` only calls `onSubmit` → `addPost` locally; **no POST** to the server. Comments on `[id].tsx` only use `addComment` in context — **no POST comment** API.
3. **API base URL:** Hard-coded `http://10.0.2.2:3000` targets the **Android emulator loopback**. **iOS simulator / physical devices** need a different host (e.g. machine LAN IP or tunnel) — should come from **env** (e.g. `EXPO_PUBLIC_API_URL`).
4. **Map ↔ forum:** `map.tsx` still uses **in-file sample** `forumPostsState`, not backend **proximity** posts (e.g. “posts within X miles”), despite backend history mentioning that direction.
5. **Response shape:** Whenever the real forum API lands on `main`, you will likely need a small **`mapApiPostToForumPost`** (or shared Zod/schema) so DB field names match `ForumPost` / `ForumComment`.

---

## 3. Recommended order of work (my(Tony) integration track)

Work in thin vertical slices so each step is demoable. Align with **Carlos / Weston** on route paths, auth (JWT/session), and JSON shape **before** locking types.

### Phase A — Make `main` runnable end-to-end

1. **Merge or cherry-pick** the real Elysia app + forum module from **`Westons-Backend-Workflow-Setup`** (or whichever branch the team agreed is canonical), so `GET /forum/posts` (and related routes) actually exist when you run `backend` on port 3000.
2. Add **`EXPO_PUBLIC_API_URL`** (or team convention) and replace the hard-coded `10.0.2.2` string in `forum.tsx` (and future calls). Document the value per platform (Android emulator vs iOS vs device).

### Phase B — One data path for the forum UI

3. **Hydrate forum state from the API:** e.g. on load, `GET /forum/posts` → normalize → **`setPosts` in ForumContext** (or replace mock seed with `[]` and load from API only). Remove the split-brain `fetchedPosts ?? posts` pattern once context is authoritative.
4. **Post detail:** Load by id: either pass the post via params (quick) or **`GET /forum/posts/:id`** so detail works for server IDs without relying on mock context.
5. **Create post:** `POST` from `CreatePostModal` → on success, append returned post to context (or refetch list).

### Phase C — Comments + map integration

6. **Comments:** `POST` (and optionally `GET`) comment endpoints; after submit, update context or refetch post.
7. **Map:** Replace sample pins with **`GET` proximity posts** using user location + backend contract; reuse the same normalizer as the feed.

### Phase D — Hardening

8. **Errors & auth:** Handle 401/403 if posts require session; attach **Authorization** header from wherever login stores the token (Carlos’s wiring).
9. **Loading / empty:** I already have patterns from earlier map/forum UX work — extend to API errors and retries.

---

## 4. Coordination

- **Úlfr:** Forum-focused merge work — confirm what was merged to `main` vs what still lives on a feature branch.
- **Carlos:** Backend forum + map connection — get **exact paths**, **payloads**, and whether **demo seed data** in the DB matches the prototype location Weston mentioned.

---

## 5. Quick “done?” checklist for my tasks. if anyone wants to do these, please go ahead. pin the team or me so we know what were working on.

- [ ] Backend on `main` serves forum routes the app calls.
- [ ] One configuration for API base URL works for your target dev device.
- [ ] Feed, detail, create, and comments all use the **same** backend-backed model (no mock-only detail).
- [ ] Map markers can use **real** post locations from the backend (when that endpoint is ready).

---