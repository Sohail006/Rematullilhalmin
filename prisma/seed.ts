import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const PERMISSIONS = [
  {
    key: "applications.view",
    label: "View applications",
    description: "See aid applications list and details",
  },
  {
    key: "applications.decide",
    label: "Decide applications",
    description: "Approve or reject applications with comments",
  },
  {
    key: "users.manage",
    label: "Manage users",
    description: "Create and update board users",
  },
  {
    key: "roles.manage",
    label: "Manage roles",
    description: "Create roles and assign permissions",
  },
  {
    key: "settings.donate",
    label: "Donate settings",
    description: "Edit bank, JazzCash, and EasyPaisa details",
  },
  {
    key: "settings.contact",
    label: "Contact settings",
    description: "Edit public contact information",
  },
] as const;

async function main() {
  for (const permission of PERMISSIONS) {
    await prisma.permission.upsert({
      where: { key: permission.key },
      update: {
        label: permission.label,
        description: permission.description,
      },
      create: permission,
    });
  }

  const allPermissions = await prisma.permission.findMany();

  const adminRole = await prisma.role.upsert({
    where: { name: "Admin" },
    update: { description: "Full system access", isSystem: true },
    create: {
      name: "Admin",
      description: "Full system access",
      isSystem: true,
    },
  });

  const reviewerRole = await prisma.role.upsert({
    where: { name: "Board Reviewer" },
    update: {
      description: "Review and decide student aid applications",
      isSystem: true,
    },
    create: {
      name: "Board Reviewer",
      description: "Review and decide student aid applications",
      isSystem: true,
    },
  });

  await prisma.rolePermission.deleteMany({ where: { roleId: adminRole.id } });
  await prisma.rolePermission.createMany({
    data: allPermissions.map((permission) => ({
      roleId: adminRole.id,
      permissionId: permission.id,
    })),
  });

  const reviewerKeys = new Set(["applications.view", "applications.decide"]);
  const reviewerPermissions = allPermissions.filter((p) =>
    reviewerKeys.has(p.key),
  );
  await prisma.rolePermission.deleteMany({ where: { roleId: reviewerRole.id } });
  await prisma.rolePermission.createMany({
    data: reviewerPermissions.map((permission) => ({
      roleId: reviewerRole.id,
      permissionId: permission.id,
    })),
  });

  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD || "Admin@123";
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { username },
    update: {
      passwordHash,
      fullName: "System Administrator",
      isActive: true,
      roleId: adminRole.id,
    },
    create: {
      username,
      passwordHash,
      fullName: "System Administrator",
      roleId: adminRole.id,
    },
  });

  const defaultSettings: Record<string, string> = {
    contact: JSON.stringify({
      phone: "",
      whatsapp: "",
      email: "info@alsiratulmustaqeem.org.pk",
      address: "",
      officeHours: "",
    }),
    donate: JSON.stringify({
      bank: {
        enabled: true,
        bankName: "",
        accountTitle: "Al Sirat Ul Mustaqeem Foundation",
        accountNumber: "",
        iban: "",
        branch: "",
      },
      jazzcash: {
        enabled: false,
        accountName: "",
        mobileNumber: "",
      },
      easypaisa: {
        enabled: false,
        accountName: "",
        mobileNumber: "",
      },
      note: "Your donation helps children continue their education.",
    }),
  };

  for (const [key, value] of Object.entries(defaultSettings)) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: {},
      create: { key, value },
    });
  }

  console.log(`Seed complete. Admin login: ${username} / ${password}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
