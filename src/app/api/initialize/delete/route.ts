import { db } from "@vercel/postgres";

async function deleteTables() {
  const client = await db.connect();

  try {
    await client.sql`BEGIN`;

    await client.sql`
      DROP TABLE IF EXISTS user_roles;
    `;
    await client.sql`
      DROP TABLE IF EXISTS appUsers;
    `;
    await client.sql`
      DROP TABLE IF EXISTS roles;
    `;
    await client.sql`
      DROP FUNCTION IF EXISTS update_timestamp;
    `;

    await client.sql`COMMIT`;

    return new Response(
      JSON.stringify({
        message: "Database DELETED successfully",
        status: 200,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    await client.sql`ROLLBACK`;
    return new Response(
      JSON.stringify({
        message: "Error DELETING tables",
        status: 500,
      }),
      { status: 500 }
    );
  } finally {
    client.release(); // Asegúrate de liberar el cliente después
  }
}

export async function GET() {
  return await deleteTables();
}
