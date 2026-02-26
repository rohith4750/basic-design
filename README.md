This is a Next.js admin starter with fixed layout, auth screens, reusable UI components, and PostgreSQL integration.

## Environment Setup

Create `.env.local` (already added locally) with:

```bash
DB_USER=postgres
DB_PASSWORD=rohith1234
DB_HOST=localhost
DB_NAME=demo
DB_PORT=5432
```

You can also copy from `.env.example`.

## PostgreSQL

Start PostgreSQL locally, then run the app.  
The `/api/dashboard/users` route connects to database `demo`, table `users`, and auto-seeds demo users on first request.

## Routing System Structure

The routing system structure is defined in:

- `constants/menu.ts`

This single config file controls:

- `menuData`: Sidebar-visible menu items.
- `loginRoutes`: Public routes outside dashboard layout.
- `adminRoutes`: Internal dashboard routes (including hidden routes not shown in sidebar).

Each route config item includes:

- `name`: Display label.
- `route`: URL path.
- `file`: Component file path in this project.
- `icon`: Icon file key.
- `permissions`: Permission key.
- `showInSideMenu`: If `true`, render in sidebar.

## Add New Page

1. Create page file in `app/dashboard/.../page.tsx`.
2. Add route config object in `constants/menu.ts` (`menuData` or hidden `adminRoutes`).
3. Sidebar and active route title update automatically from config.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
