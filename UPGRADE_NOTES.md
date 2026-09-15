# Upgrading from a previous delivery of this project

If you're replacing an existing local copy of this project (e.g. at
`C:\Users\DELL\Documents\ZKRresumeai`) with this archive, **do not extract
this zip on top of the old folder.** Unzipping only overwrites/adds files —
it does not delete files that no longer exist in the new archive. If your
old folder still has `src/app/(dashboard)/templates/page.tsx` from an
earlier version, and this archive adds `src/app/templates/page.tsx`, you'll
end up with both on disk, which causes exactly this build error:

```
You cannot have two parallel pages that resolve to the same path.
Please check /(dashboard)/templates/page and /templates/page.
```

**Fix:** delete your old project folder entirely (or at least delete
`node_modules`, `.next`, and the `src` folder) before extracting this
archive, so no stale files from a previous version remain. Then:

```bash
npm install
cp .env.example .env   # fill in real values
npx prisma generate
npm run dev
```

This archive's own source tree has been verified to contain **no duplicate
route** — only:
- `src/app/templates/page.tsx` → public gallery
- `src/app/(dashboard)/dashboard/templates/page.tsx` → authenticated page
