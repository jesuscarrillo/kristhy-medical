async function main() {
  const { config } = await import("dotenv");
  config({ path: ".env.local.local" });
  config();

  const { prisma } = await import("../src/lib/prisma");
  const { auth } = await import("../src/lib/auth");

  await prisma.$connect();

  const email = process.env.SEED_DOCTOR_EMAIL;
  const password = process.env.SEED_DOCTOR_PASSWORD;
  const name = process.env.SEED_DOCTOR_NAME ?? "Dra. Kristhy";

  if (!email || !password) {
    console.warn("Seed skipped: SEED_DOCTOR_EMAIL/SEED_DOCTOR_PASSWORD not set.");
    return;
  }

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (!existingUser) {
    await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
        role: "doctor",
      },
    });
    console.log("Doctor user created.");
  } else {
    console.log("Doctor user already exists.");
  }
}

main()
  .catch((error) => {
    console.error("Seed error:", error);
    process.exit(1);
  })
  .finally(async () => {
    const { prisma } = await import("../src/lib/prisma");
    await prisma.$disconnect();
  });
