# eContract CMS — Hướng dẫn dự án

Web tủ quần áo kĩ thuật số. Tài liệu này mô tả tech stack, cấu trúc thư mục
và **quy ước bắt buộc** khi thêm code mới. Đọc kỹ phần "Quy ước cấu trúc" trước khi tạo file.

## Tech stack

| Mảng | Thư viện |
|------|----------|
| Build / dev server | **Vite 6** + `@vitejs/plugin-react-swc` |
| Ngôn ngữ | **React 19** + **TypeScript** (strict) |
| Routing | **TanStack Router** (file-based, `routeTree.gen.ts` tự sinh) |
| Data fetching | **TanStack Query** (`@tanstack/react-query`) |
| HTTP client | **Axios** (instance dùng chung ở `src/lib/api.ts`) |
| Validation | **Zod** (validate cả form lẫn response API) |
| State toàn cục | **Zustand** (+ `persist`) |
| Styling | **TailwindCSS v4** (`@tailwindcss/vite`) |
| UI components | **shadcn/ui** (preset Nova / Radix) |

## Lệnh thường dùng

```bash
npm run dev        # Dev server: http://localhost:3000 (proxy /api → VITE_API_URL)
npm run build      # tsc -b && vite build  (build production, CÓ type-check)
npm run typecheck  # tsc --noEmit
npm run lint       # eslint .
npm run preview    # Smoke-test bản build (KHÔNG phải server production)
```

## Cấu trúc thư mục

```
src/
├── components/              # Component DÙNG CHUNG toàn app
│   ├── ui/                  #   shadcn (button, card, input, label, badge…) — không sửa tay
│   └── layout/              #   AppLayout (sidebar shadcn + header) = AppSidebar + AppHeader
│
├── features/                # Mỗi feature là một folder tự chứa
│   └── <tên-feature>/
│       ├── api.ts           #   các hàm gọi Axios + parse Zod
│       ├── queries.ts       #   hook useQuery / useMutation + query keys
│       ├── components/      #   component CHỈ dùng riêng trong feature này
│       └── pages/           #   page-level component (UI của cả màn hình)
│
├── routes/                  # CHỈ wiring route (TanStack Router) — file mỏng
│   ├── __root.tsx           #   root: <Outlet> + devtools
│   ├── _app.tsx             #   layout có guard (chưa login → /login)
│   ├── _app.index.tsx       #   "/"            → DashboardPage
│   ├── _app.contracts.index.tsx  # "/contracts" → ContractsPage
│   ├── _app.employees.index.tsx  # "/employees" → EmployeesPage
│   └── login.tsx            #   "/login"        → LoginPage
│
├── interfaces/              # Kiểu (TS interface) dùng chung — vd envelope ApiResponse
├── schemas/                 # Zod schema + type suy ra (z.infer)
├── stores/                  # Zustand store (vd: authStore)
├── lib/                     # Hạ tầng dùng chung (api.ts, queryClient.ts, utils.ts)
└── styles.css               # Tailwind + theme tokens (shadcn)
```

## Quy ước cấu trúc (QUAN TRỌNG)

### 1. Đặt component đúng chỗ

| Component dùng ở đâu | Đặt vào |
|----------------------|---------|
| Chỉ trong 1 feature  | `src/features/<tên>/components/` |
| Dùng chung nhiều nơi | `src/components/` (`ui`, `layout`) |

### 2. `routes/` chỉ làm wiring

File trong `routes/` **chỉ** chứa: `beforeLoad` (guard), `loader` (prefetch), và trỏ tới
`component`. **Không** viết UI trong route. UI nằm ở `features/<tên>/pages/`.

```tsx
// routes/_app.contracts.index.tsx — ví dụ route mỏng
export const Route = createFileRoute('/_app/contracts/')({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData({
      queryKey: contractKeys.lists(),
      queryFn: fetchContracts,
    }),
  component: ContractsPage,   // UI thật ở features/contracts/pages/
})
```

### 3. Page chỉ lắp ráp

`pages/XxxPage.tsx` chủ yếu gọi hook lấy data + ráp các component của feature lại.
Logic UI nhỏ tách ra `features/<tên>/components/`.

## Công thức thêm một màn hình mới

1. `src/features/<tên>/api.ts` — hàm Axios + `schema.parse(data)`.
2. `src/features/<tên>/queries.ts` — hook `useXxx` (useQuery/useMutation) + query keys.
3. `src/features/<tên>/components/` — các component con (nếu cần).
4. `src/features/<tên>/pages/XxxPage.tsx` — ráp lại thành màn hình.
5. `src/routes/...tsx` — route mỏng trỏ tới `XxxPage`. Chạy `npm run dev` để
   plugin tự sinh lại `routeTree.gen.ts`.

## Tầng dữ liệu (Axios + Zod + React Query)

- Mọi request đi qua instance `src/lib/api.ts` (baseURL `/api`, tự gắn token, tự logout khi 401).
- **Envelope chuẩn**: backend luôn bọc payload trong `{ data, message }` (kiểu
  `ApiResponse<T>` ở `src/interfaces/api-response.ts`). Tầng `api.ts` phải unwrap `.data`.
- **Luôn validate response bằng Zod tại boundary** — đừng tin dữ liệu từ server:
  ```ts
  const { data } = await api.get<ApiResponse<unknown>>('/contracts')
  return contractListSchema.parse(data.data)   // unwrap .data rồi parse
  ```
- Query keys gom tập trung trong `queries.ts` (vd `contractKeys`), sau mutation thì
  `invalidateQueries` để refetch.

## Thông báo (toast)

- Dùng **react-hot-toast**. `<Toaster />` đã mount sẵn ở `src/main.tsx`.
- **Lỗi API tự động hiện toast** qua global handler trong `src/lib/queryClient.ts`
  (`QueryCache`/`MutationCache` `onError`) — KHÔNG cần tự bắt lỗi & toast ở từng component.
- Thông điệp lỗi lấy từ `getApiErrorMessage()` (`src/lib/error.ts`, ưu tiên `message` của server).
- Toast **thành công** thì gọi thủ công trong `onSuccess` của mutation:
  `toast.success('Tạo hợp đồng thành công')`.

## Auth & routing

- Session lưu ở `src/stores/authStore.ts` (Zustand + `persist` localStorage).
- Layout `routes/_app.tsx` có guard: chưa đăng nhập → redirect `/login`. Mọi trang
  cần đăng nhập đặt **dưới** `_app` (đặt tên file `_app.*.tsx`).
- Backend cần: `POST /api/auth/login` → `{ token, user: { id, name, email } }`.

## Styling & thêm UI component

- Tailwind v4 — viết class trực tiếp; dùng token theme (`bg-background`, `text-muted-foreground`…).
- Thêm component shadcn: `npx shadcn@latest add <tên>` (vd `dialog`, `table`). File sinh ra ở
  `src/components/ui/` — **không sửa tay** trừ khi thật sự cần.
- Helper gộp class: `cn()` trong `src/lib/utils.ts`.

## Git hooks (Husky)

- Hook **`pre-push`** chạy `npm run build`. Build fail → **chặn push**.
- Vì `build = tsc -b && vite build`, push sẽ bị chặn cả khi có lỗi TypeScript.
- Khẩn cấp mới dùng `git push --no-verify`.

## Biến môi trường

- Chỉ biến tiền tố `VITE_` mới lộ ra client (bị inline vào bundle — **không để secret**).
- `VITE_API_URL` = origin backend (mặc định `http://localhost:8080`). Xem `.env.example`.

## Lưu ý
- `src/routeTree.gen.ts` do plugin **tự sinh** — không sửa tay, không review.
- ESLint bỏ qua `routes/**` và `components/ui/**` cho rule `react-refresh` (pattern hợp lệ).
- `vite build` KHÔNG báo lỗi type — type-check do `tsc` (đã nằm trong `build`) và
  `vite-plugin-checker` lo lúc dev.
