# TaskFlow

Aplikasi manajemen tugas bergaya Kanban board — buat board, atur kolom, kelola task dengan drag & drop, lengkap dengan autentikasi dan ownership per user.

🔗 **Live Demo:** [task-flow-gamma-sable.vercel.app](https://task-flow-gamma-sable.vercel.app)

---

## Screenshot

## Screenshot

![TaskFlow login page](public/screenshots/login.png)

![TaskFlow board view](public/screenshots/board#1.png),(public/screenshots/board#2.png)

---

## Fitur

- **Autentikasi** — register, login, logout dengan JWT (httpOnly cookie)
- **Board & Column** — buat board, tambah kolom (mis. To Do / In Progress / Done)
- **Task CRUD** — buat, edit, hapus task dengan judul, deskripsi, prioritas, dan due date
- **Drag & Drop** — pindahkan task antar kolom dan urutkan posisi, dengan optimistic update + rollback jika request gagal
- **Ownership** — setiap user hanya bisa mengakses board, kolom, dan task miliknya sendiri
- **Search** — cari task berdasarkan judul
- **Dark mode** & tampilan responsif (mobile-friendly)
- **Confirmation dialog** untuk aksi hapus

---

## Tech Stack

| Layer       | Teknologi                                                  |
| ----------- | ---------------------------------------------------------- |
| Framework   | Next.js (App Router) + TypeScript                          |
| Styling     | Tailwind CSS                                               |
| Database    | PostgreSQL (Supabase)                                      |
| ORM         | Prisma                                                     |
| Auth        | JWT custom (httpOnly cookie)                               |
| Drag & Drop | `@dnd-kit`                                                 |
| Testing     | Vitest + integration test                                  |
| CI          | GitHub Actions (lint, type-check, test otomatis tiap push) |
| Deployment  | Vercel                                                     |

---

## Cara Menjalankan di Lokal

### 1. Clone repository

```bash
git clone https://github.com/sillvertjie/TaskFlow.git
cd TaskFlow
```

### 2. Install dependencies

```bash
npm install
```

### 3. Siapkan environment variable

Buat file `.env` di root project, isi seperti berikut:

```dotenv
DATABASE_URL=postgresql://user:password@host:port/database
DIRECT_URL=postgresql://user:password@host:port/database
JWT_SECRET=ganti-dengan-string-acak-yang-aman
```

Lihat penjelasan tiap variable di bagian [Environment Variable](#environment-variable) di bawah.

### 4. Jalankan migration database

```bash
npx prisma migrate deploy
```

### 5. Jalankan development server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

### Perintah lain yang berguna

```bash
npm run lint        # jalankan ESLint
npm run format      # format kode dengan Prettier
npx tsc --noEmit    # type-check tanpa build
npm test            # jalankan seluruh test (Vitest)
npx prisma studio   # buka Prisma Studio untuk lihat isi database
```

---

## Environment Variable

| Variable       | Keterangan                                                                                                                                                             |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DATABASE_URL` | Connection string PostgreSQL (dipakai Prisma Client saat runtime)                                                                                                      |
| `DIRECT_URL`   | Connection string langsung ke database (dipakai saat menjalankan migration)                                                                                            |
| `JWT_SECRET`   | String rahasia untuk sign/verify token JWT. Gunakan string acak yang kuat, contoh generate: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |

---

## Struktur Folder

```
app/            → Routes (pages) & API routes (App Router)
components/     → Komponen UI (tasks, theme, dialog, dll)
lib/            → Logic inti: auth, prisma client, validators, API test helpers
prisma/         → Schema database & migration history
```

---

## Deployment

Project ini di-deploy otomatis ke **Vercel**, terhubung langsung dengan branch `master` di GitHub — setiap push ke `master` akan trigger deployment baru.

Environment variable production (`DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET`) diatur langsung di dashboard Vercel (Project Settings → Environment Variables).

CI (GitHub Actions) berjalan otomatis di setiap push dan pull request, menjalankan lint, type-check, dan seluruh test integration terhadap Postgres service container sementara — lihat `.github/workflows/ci.yml`.

---

## Dibuat oleh

**Trisno Manurung**
GitHub: [@sillvertjie](https://github.com/sillvertjie)
