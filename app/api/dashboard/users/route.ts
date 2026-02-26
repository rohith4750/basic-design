import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { pg } from "@/lib/postgres";

type UserRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
};

const seedUsers: UserRow[] = [
  { id: "u-101", name: "Aarav Patel", email: "aarav@starter.com", role: "Frontend Engineer", status: "Active", lastLogin: "2026-02-26 10:12" },
  { id: "u-102", name: "Meera Iyer", email: "meera@starter.com", role: "UI Designer", status: "Active", lastLogin: "2026-02-26 09:01" },
  { id: "u-103", name: "Kabir Khan", email: "kabir@starter.com", role: "QA Engineer", status: "Pending", lastLogin: "2026-02-24 17:40" },
  { id: "u-104", name: "Isha Verma", email: "isha@starter.com", role: "Backend Engineer", status: "Inactive", lastLogin: "2026-02-18 12:22" },
  { id: "u-105", name: "Neel Sharma", email: "neel@starter.com", role: "Product Manager", status: "Active", lastLogin: "2026-02-26 08:32" },
  { id: "u-106", name: "Anaya Singh", email: "anaya@starter.com", role: "DevOps Engineer", status: "Pending", lastLogin: "2026-02-25 20:15" },
];

const sortableColumnMap = {
  name: "name",
  role: "role",
  status: "status",
  lastLogin: "last_login",
  email: "email",
} as const;

async function prepareUsersTable() {
  await pg.query(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      role TEXT NOT NULL,
      status TEXT NOT NULL,
      last_login TEXT NOT NULL
    )
  `);

  const countResult = await pg.query<{ count: string }>("SELECT COUNT(*)::text AS count FROM users");
  const count = Number(countResult.rows[0]?.count ?? "0");

  if (count === 0) {
    const values: string[] = [];
    const params: string[] = [];

    seedUsers.forEach((user, index) => {
      const i = index * 6;
      values.push(`($${i + 1}, $${i + 2}, $${i + 3}, $${i + 4}, $${i + 5}, $${i + 6})`);
      params.push(user.id, user.name, user.email, user.role, user.status, user.lastLogin);
    });

    await pg.query(`INSERT INTO users (id, name, email, role, status, last_login) VALUES ${values.join(", ")}`, params);
  }
}

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token");

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prepareUsersTable();

  const searchParams = new URL(request.url).searchParams;
  const search = searchParams.get("search")?.trim() ?? "";
  const role = searchParams.get("role")?.trim() ?? "";
  const status = searchParams.get("status")?.trim() ?? "";
  const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);
  const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") ?? "10") || 10));
  const offset = (page - 1) * limit;

  const sortByParam = (searchParams.get("sortBy") ?? "name") as keyof typeof sortableColumnMap;
  const sortBy = sortableColumnMap[sortByParam] ?? sortableColumnMap.name;
  const sortDirection = searchParams.get("sortDirection")?.toLowerCase() === "desc" ? "DESC" : "ASC";

  const whereParts: string[] = [];
  const whereParams: string[] = [];

  if (search) {
    whereParts.push(`(name ILIKE $${whereParams.length + 1} OR email ILIKE $${whereParams.length + 1} OR role ILIKE $${whereParams.length + 1})`);
    whereParams.push(`%${search}%`);
  }
  if (role) {
    whereParts.push(`role = $${whereParams.length + 1}`);
    whereParams.push(role);
  }
  if (status) {
    whereParts.push(`status = $${whereParams.length + 1}`);
    whereParams.push(status);
  }

  const whereClause = whereParts.length > 0 ? `WHERE ${whereParts.join(" AND ")}` : "";

  const totalResult = await pg.query<{ count: string }>(`SELECT COUNT(*)::text AS count FROM users ${whereClause}`, whereParams);
  const totalItems = Number(totalResult.rows[0]?.count ?? "0");
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));

  const usersResult = await pg.query<UserRow>(
    `
      SELECT id, name, email, role, status, last_login AS "lastLogin"
      FROM users
      ${whereClause}
      ORDER BY ${sortBy} ${sortDirection}
      LIMIT $${whereParams.length + 1}
      OFFSET $${whereParams.length + 2}
    `,
    [...whereParams, String(limit), String(offset)],
  );

  return NextResponse.json({
    data: usersResult.rows,
    meta: {
      page,
      limit,
      totalItems,
      totalPages,
      sortBy: sortByParam,
      sortDirection: sortDirection.toLowerCase(),
      filters: { search, role, status },
    },
  });
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("session_token");

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prepareUsersTable();

  const body = await request.json().catch(() => null);
  const name = body?.name?.trim();
  const email = body?.email?.trim().toLowerCase();
  const role = body?.role?.trim();
  const status = body?.status?.trim();

  if (!name || !email || !role || !status) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }

  const allowedStatus = new Set(["Active", "Pending", "Inactive"]);
  if (!allowedStatus.has(status)) {
    return NextResponse.json({ error: "Invalid status value." }, { status: 400 });
  }

  const existing = await pg.query<{ id: string }>("SELECT id FROM users WHERE email = $1 LIMIT 1", [email]);
  if ((existing.rowCount ?? 0) > 0) {
    return NextResponse.json({ error: "User with this email already exists." }, { status: 409 });
  }

  const id = `u-${Date.now().toString().slice(-6)}`;
  const lastLogin = new Date().toISOString().slice(0, 16).replace("T", " ");

  const insertResult = await pg.query<UserRow>(
    `
      INSERT INTO users (id, name, email, role, status, last_login)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, name, email, role, status, last_login AS "lastLogin"
    `,
    [id, name, email, role, status, lastLogin],
  );

  return NextResponse.json({ data: insertResult.rows[0] }, { status: 201 });
}
