# Al Sirat Ul Mustaqeem Foundation

Website for educational financial aid applications, board review, and public donate/contact pages.

**Domain:** [alsiratulmustaqeem.org.pk](https://alsiratulmustaqeem.org.pk)

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Prisma + SQLite (local) / PostgreSQL (Vercel via Neon)
- next-intl (English / Urdu)
- JWT session auth + role-based permissions
- Vercel Blob (production uploads) / local disk (development)
- Resend (optional email notifications)

## Quick start (local)

```bash
npm install
npm run db:setup
npm run dev
```

**No Docker?** SQLite works locally out of the box. For Vercel, use Neon PostgreSQL (see Deploy section).

Open [http://localhost:3000](http://localhost:3000)

### Default admin

- Username: `admin`
- Password: `Admin@123`

Change `ADMIN_PASSWORD` in `.env` before seeding in production.

## Main routes

| Route | Purpose |
|-------|---------|
| `/en` or `/ur` | Public site |
| `/en/apply` | Student/guardian aid application |
| `/en/status` | Check application status (reference + CNIC) |
| `/en/donate` | Donation details (from admin settings) |
| `/en/contact` | Contact details (from admin settings) |
| `/admin/login` | Board login |
| `/admin` | Dashboard |

## Admin capabilities

- Review applications → approve/reject with comments
- Export applications to CSV
- Create board users (unique username + password)
- Roles & permissions matrix
- Donate settings (Bank / JazzCash / EasyPaisa)
- Contact settings
- Change own password

## Email notifications (optional)

Set in Vercel / `.env`:

- `RESEND_API_KEY` — from [resend.com](https://resend.com)
- `EMAIL_FROM` — verified sender, e.g. `Foundation <noreply@alsiratulmustaqeem.org.pk>`
- `ADMIN_NOTIFY_EMAIL` — receives alert on new applications

When configured:

- New application → email to admin
- Approve/reject → email to applicant (if they provided email)

## Deploy on Vercel

1. Push repo to GitHub and import in Vercel
2. Create PostgreSQL on [Neon](https://neon.tech) and set `DATABASE_URL`
3. In `prisma/schema.prisma`, change `provider` from `sqlite` to `postgresql`
4. Run once (local with production `DATABASE_URL` or Neon SQL console):
   ```bash
   npx prisma db push
   npm run db:seed
   ```
4. Set environment variables:
   - `DATABASE_URL`
   - `AUTH_SECRET` (long random string)
   - `NEXT_PUBLIC_SITE_URL=https://alsiratulmustaqeem.org.pk`
   - `BLOB_READ_WRITE_TOKEN` (Vercel Blob — required for uploads on Vercel)
   - `RESEND_API_KEY`, `EMAIL_FROM`, `ADMIN_NOTIFY_EMAIL` (optional)
5. Add custom domain `alsiratulmustaqeem.org.pk` in Vercel
6. Replace `public/logo.png` with the official foundation logo

## Notes

- Application status lookup requires **reference number + CNIC** (privacy)
- Aid is documented as paid to school after board approval
- Admin role cannot lose permissions (system role)
