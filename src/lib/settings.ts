import { prisma } from "@/lib/db";
import type { ContactSettings, DonateSettings } from "@/lib/constants";

export async function getSetting<T>(key: string, fallback: T): Promise<T> {
  const row = await prisma.siteSetting.findUnique({ where: { key } });
  if (!row) return fallback;
  try {
    return JSON.parse(row.value) as T;
  } catch {
    return fallback;
  }
}

export async function setSetting(key: string, value: unknown) {
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
