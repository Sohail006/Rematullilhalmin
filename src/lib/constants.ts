export const PERMISSION_KEYS = [
  "applications.view",
  "applications.decide",
  "users.manage",
  "roles.manage",
  "settings.donate",
  "settings.contact",
] as const;

export type PermissionKey = (typeof PERMISSION_KEYS)[number];

export const APPLICATION_STATUSES = [
  "PENDING",
  "APPROVED",
  "REJECTED",
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export type ContactSettings = {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  officeHours: string;
};

export type DonateSettings = {
  bank: {
    enabled: boolean;
    bankName: string;
    accountTitle: string;
    accountNumber: string;
    iban: string;
    branch: string;
  };
  jazzcash: {
    enabled: boolean;
    accountName: string;
    mobileNumber: string;
  };
  easypaisa: {
    enabled: boolean;
    accountName: string;
    mobileNumber: string;
  };
  note: string;
};
