import "dotenv/config";
import { pool } from "./src/back-end/database/mariadb.js";
import { createUser } from "./src/back-end/database/user.database.js";

async function main() {
  const user = await createUser({
    email: `test_${Date.now()}@example.com`,
    password: "test-password",
    name: "Test User",
    phone_number: "0000000000",
    age: 20,
    gender: "other",
    dateofbirth: "2005-01-01",
    job: "Tester"
  });

  console.log("Created user:", user);
}

main()
  .catch((err) => {
    console.error("Test failed:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    try {
      await pool.end();
    } catch {
    }
  });