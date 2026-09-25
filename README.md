# The Q Collection — Website + Admin Dashboard

A dark green / black / gold luxury furniture site, plus a password-protected
admin dashboard for managing categories, products, images, and site settings.

**Stack:** React + Vite (frontend, static — deploy anywhere) and
[Supabase](https://supabase.com) (database, image storage, and login —
free tier is enough for this site).

---

## 1. Create your Supabase project

1. Go to [supabase.com](https://supabase.com) and create a free account and a
   new project. Pick any name and region; save the database password it asks
   you to set (you won't need it for this setup, but keep it somewhere safe).
2. Once the project is ready, open **SQL Editor** in the left sidebar, click
   **New query**, paste in the entire contents of `supabase/schema.sql` from
   this project, and click **Run**. This creates all the tables, security
   rules, the image storage bucket, and the starter categories.
3. Go to **Project Settings > API**. You'll need two values from this page in
   the next step: the **Project URL** and the **anon public** key.

## 2. Connect the site to your project

In this project's root folder:

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in the two values from step 1:

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

Then install and run:

```bash
npm install
npm run dev
```

The public site will now load (with the starter categories, no products yet).

## 3. Create your admin login

The dashboard doesn't have a public sign-up page — only one person is meant
to log in, and you create that account yourself:

1. In Supabase, go to **Authentication > Users > Add user > Create new user**.
   Enter the email and password you want to log in with, and make sure
   **Auto Confirm User** is checked.
2. Copy the new user's **User UID** shown in the users list.
3. Go back to **SQL Editor** and run:
   ```sql
   insert into admins (user_id) values ('paste-the-user-uid-here');
   ```

That's it — go to `/admin/login` on your site and sign in with that email and
password.

## 4. Add your content

Once logged in at `/admin`:

- **Categories** — the 7 starter categories are already there in order. Edit,
  reorder (↑↓), delete, or add new ones from `/admin/categories`.
- **Products** — add products from `/admin/products/new`, assign them to a
  category, set a name/description/price (leave price blank for
  "Enquire for Price"), and mark up to a few as *Featured* to show them on
  the homepage.
- **Images** — open any product's edit page and upload one or more photos
  directly there. The first image becomes that product's cover photo
  everywhere on the site (cards, category grid, etc). Reorder with the arrow
  buttons, or delete individual images. No local files or folders involved —
  everything uploads straight to cloud storage.
- **Settings** — `/admin/settings` controls the homepage hero photo and every
  contact detail (phone, WhatsApp, email, address, hours) shown across the
  site and footer.

Every change is live on the public site immediately — there's no rebuild or
redeploy step needed for content changes.

## 5. Deploy

Push this project to a static host (Vercel, Netlify, or similar). When
setting it up, add the same two environment variables from step 2
(`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`) in the host's project
settings — the build needs them to connect to your Supabase project.

The admin dashboard lives at `yourdomain.com/admin` — nothing separate to
deploy.

---

## Project structure

```
supabase/
  schema.sql        run once in the Supabase SQL editor — sets up everything

src/
  lib/
    supabase.js      Supabase client
    api.js           every read/write query the site makes
    auth.jsx          auth context provider
    authActions.js    sign in / sign out / useAuth hook
  hooks/
    useAsync.js      small hook for loading/error/data state

  components/         shared UI: Navbar, Footer, Hero, ProductCard, etc.
  pages/              public pages: Home, Shop, CategoryPage, ProductPage,
                       About, Contact, NotFound

  admin/
    RequireAuth.jsx   redirects to /admin/login if not signed in
    AdminLayout.jsx   sidebar + logout
    Login.jsx
    Dashboard.jsx     overview stats
    CategoriesList.jsx / CategoryForm.jsx
    ProductsList.jsx / ProductForm.jsx   (includes the image manager)
    Settings.jsx      hero photo + contact details
```

## Notes

- **Prices**: leave a product's price blank in the admin form to show
  "Enquire for Price" — the same as before, just editable live now instead of
  in a code file.
- **Security**: the database rules (in `schema.sql`) mean anyone can *view*
  categories/products/images, but only the user(s) listed in the `admins`
  table can create, edit, or delete anything — even someone with your Supabase
  anon key can't write data without being logged in as that admin.
- **Costs**: Supabase's free tier includes a database, 1GB of file storage,
  and unlimited API requests within generous limits — comfortably enough for
  a small furniture catalogue. You'd only need to upgrade if the site grows
  significantly (many thousands of visits or a huge image library).
