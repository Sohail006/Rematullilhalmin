import { prisma } from "@/lib/db";
import type { ContactSettings, DonateSettings } from "@/lib/constants";

export function isDatabaseConfigured(): boolean {
  const url = process.env.DATABASE_URL ?? "";
  return (
    url.startsWith("postgresql://") || url.startsWith("postgres://")
  );
}

export async function getSetting<T>(key: string, fallback: T): Promise<T> {
  if (!isDatabaseConfigured()) return fallback;

  try {
    const row = await prisma.siteSetting.findUnique({ where: { key } });
    if (!row) return fallback;
    return JSON.parse(row.value) as T;
  } catch {
    return fallback;
  }
}

export async function setSetting(key: string, value: unknown) {
  if (!isDatabaseConfigured()) {
    throw new Error("DATABASE_URL is not configured");
  }

  const serialized = JSON.stringify(value);
  await prisma.siteSetting.upsert({
    where: { key },
    update: { value: serialized },
    create: { key, value: serialized },
  });
}

export const defaultContact: ContactSettings = {
  phone: "",
  whatsapp: "",
  email: "info@alsiratulmustaqeem.org.pk",
  address: "",
  officeHours: "",
};

export const defaultDonate: DonateSettings = {
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
};

export async function getContactSettings() {
  return getSetting<ContactSettings>("contact", defaultContact);
}

export async function getDonateSettings() {
  return getSetting<DonateSettings>("donate", defaultDonate);
}

export function generateReferenceNo() {
  const year = new Date().getFullYear();
  const random = Math.floor(100000 + Math.random() * 900000);
  return `ASM-${year}-${random}`;
}

export async function generateUniqueReferenceNo(): Promise<string> {
  if (!isDatabaseConfigured()) {
    return generateReferenceNo();
  }

  for (let attempt = 0; attempt < 8; attempt += 1) {
    const referenceNo = generateReferenceNo();
    const existing = await prisma.application.findUnique({
      where: { referenceNo },
      select: { id: true },
    });
    if (!existing) return referenceNo;
  }

  return `ASM-${Date.now()}`;
}
