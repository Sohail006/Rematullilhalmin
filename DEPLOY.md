# Deploy checklist — Al Sirat Ul Mustaqeem Foundation

## 1. Database (Neon PostgreSQL)

1. Create a free database at [neon.tech](https://neon.tech)
2. Copy the connection string
3. In `prisma/schema.prisma`, change:
   ```prisma
   provider = "postgresql"
   ```
4. Run once with production `DATABASE_URL`:
   ```bash
   npx prisma db push
   npm run db:seed
   ```
5. **Change `ADMIN_PASSWORD` in `.env` before seeding** — then log in and change password again in `/admin/profile`

## 2. Vercel project

1. Push this repo to GitHub
2. Import project in [vercel.com](https://vercel.com)
3. Set environment variables:

| Variable | Value |
|----------|--------|
| `DATABASE_URL` | Neon connection string |
| `AUTH_SECRET` | Random 32+ char string |
| `NEXT_PUBLIC_SITE_URL` | `https://alsiratulmustaqeem.org.pk` |
| `BLOB_READ_WRITE_TOKEN` | From Vercel → Storage → Blob |
| `ADMIN_USERNAME` | `admin` (only for first seed) |
| `ADMIN_PASSWORD` | Strong password (only for first seed) |
| `RESEND_API_KEY` | Optional — email notifications |
| `EMAIL_FROM` | Optional — verified sender |
| `ADMIN_NOTIFY_EMAIL` | Optional — new application alerts |

4. Deploy

## 3. Domain

1. Vercel → Project → Settings → Domains
2. Add `alsiratulmustaqeem.org.pk` and `www.alsiratulmustaqeem.org.pk`
3. Update DNS at your registrar per Vercel instructions

## 4. After launch

1. Log in as admin → **Contact settings** (phone, WhatsApp, email, address)
2. **Donate settings** (bank, JazzCash, EasyPaisa)
3. Create board users and assign roles
4. Change admin password in **My profile**
5. Test apply form + status check on mobile

## 5. Logo

Official logo is at `public/logo.png`. Replace this file if you receive an updated seal.
