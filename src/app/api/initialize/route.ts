/* eslint-disable @typescript-eslint/no-unused-vars */

import { db } from "@vercel/postgres";
import bcrypt from "bcrypt";

const client = await db.connect();

async function createRolesTable() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
  await client.sql`
    CREATE TABLE IF NOT EXISTS roles (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT NOT NULL
    );
  `;

  return await client.sql`
    INSERT INTO roles (name, description)
    VALUES ('SuperAdmin', 'Tiene todos los permisos del sistema')
    ON CONFLICT DO NOTHING;
  `;
}

async function createUsersTable() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await client.sql`
    CREATE TABLE IF NOT EXISTS appUsers (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      first_name VARCHAR(50),
      last_name VARCHAR(50),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  // Crear el trigger para actualizar el campo updated_at automáticamente
  await client.sql`
    CREATE OR REPLACE FUNCTION update_timestamp()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `;

  await client.sql`
    CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON appUsers
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();
  `;
}

async function createUserRolesTable() {
  await client.sql`
    CREATE TABLE IF NOT EXISTS user_roles (
      appuser_id UUID,
      role_id UUID,
      FOREIGN KEY (appuser_id) REFERENCES appUsers(id),
      FOREIGN KEY (role_id) REFERENCES roles(id),
      PRIMARY KEY (appuser_id, role_id)
    );
  `;
}

async function createSuperAdminUser() {
  const hashedPassword = await bcrypt.hash("strong_password_here", 10);
  const userResult = await client.sql`
    INSERT INTO appUsers (username, email, password)
    VALUES ('superadmin', 'superadmin@example.com', ${hashedPassword})
    RETURNING id;
  `;
  return userResult.rows[0].id;
}

async function assignRoleToUser(userId: string) {
  const roleResult = await client.sql`
    SELECT id FROM roles WHERE name = 'SuperAdmin'
  `;

  if (roleResult.rowCount === 0) {
    throw new Error("Role not found");
  }
  const roleId = roleResult.rows[0].id;

  await client.sql`
    INSERT INTO user_roles (appuser_id, role_id)
    VALUES (${userId}, ${roleId});
  `;
}

export async function GET() {
  try {
    await client.sql`BEGIN`;
    await createRolesTable();
    await createUsersTable();
    await createUserRolesTable();
    const userId = await createSuperAdminUser();
    await assignRoleToUser(userId);

    await client.sql`COMMIT`;
    return new Response(
      JSON.stringify({
        message: "Database seeded successfully",
        status: 200,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    await client.sql`ROLLBACK`;
    return new Response(
      JSON.stringify({
        message: "Error creating tables or user",
        status: 500,
      }),
      { status: 500 }
    );
  }
}
