import { z } from "zod";

/** Pakistani CNIC: 13 digits, optional dashes XXXXX-XXXXXXX-X */
export const cnicSchema = z
  .string()
  .trim()
  .transform((value) => value.replace(/[-\s]/g, ""))
  .refine((value) => /^\d{13}$/.test(value), {
    message: "CNIC must be 13 digits (XXXXX-XXXXXXX-X)",
  })
  .refine((value) => /^[0-9]{5}[0-9]{7}[0-9]$/.test(value), {
    message: "Enter a valid Pakistani CNIC",
  });

/** Pakistani mobile: 03XXXXXXXXX (11 digits) */
export const mobileSchema = z
  .string()
  .trim()
  .transform((value) => value.replace(/[\s-]/g, ""))
  .refine((value) => /^03\d{9}$/.test(value), {
    message: "Mobile must be 11 digits starting with 03 (e.g. 03001234567)",
  });

export function formatCnic(digits: string): string {
  const clean = digits.replace(/\D/g, "").slice(0, 13);
  if (clean.length <= 5) return clean;
  if (clean.length <= 12) return `${clean.slice(0, 5)}-${clean.slice(5)}`;
  return `${clean.slice(0, 5)}-${clean.slice(5, 12)}-${clean.slice(12)}`;
}

export function formatMobile(digits: string): string {
  return digits.replace(/\D/g, "").slice(0, 11);
}

export const applicationFormSchema = z
  .object({
    applicantType: z.enum(["STUDENT", "GUARDIAN"]),
    fullName: z.string().trim().min(3, "Full name is required"),
    guardianName: z.string().trim().min(3, "Guardian / father name is required"),
    cnic: cnicSchema,
    mobile: mobileSchema,
    email: z
      .string()
      .trim()
      .email("Invalid email")
      .optional()
      .or(z.literal("")),
    city: z.string().trim().min(2, "City is required"),
    address: z.string().trim().min(5, "Address is required"),
    schoolName: z.string().trim().min(2, "School name is required"),
    schoolAddress: z.string().trim().min(5, "School address is required"),
    classGrade: z.string().trim().min(1, "Class / grade is required"),
    previousMarks: z.string().trim().min(1, "Previous marks are required"),
    feeAmount: z.coerce
      .number()
      .positive("Fee amount must be greater than 0")
      .max(5_000_000, "Fee amount cannot exceed PKR 5,000,000"),
    incomeInfo: z.string().trim().min(5, "Income information is required"),
    hasDisability: z.coerce.boolean(),
    disabilityInfo: z.string().trim().optional().or(z.literal("")),
    declaration: z.boolean().refine((value) => value === true, {
      message: "You must accept the declaration",
    }),
  })
  .superRefine((value, ctx) => {
    if (value.hasDisability && !value.disabilityInfo?.trim()) {
      ctx.addIssue({
        code: "custom",
        message: "Please provide disability details",
        path: ["disabilityInfo"],
      });
    }
  });

export const donationNotifySchema = z.object({
  donorName: z.string().trim().min(3, "Donor name is required"),
  mobile: mobileSchema,
  email: z
    .string()
    .trim()
    .email("Invalid email")
    .optional()
    .or(z.literal("")),
  amount: z.coerce
    .number()
    .positive("Amount must be greater than 0")
    .max(10_000_000, "Amount cannot exceed PKR 10,000,000"),
  method: z.enum(["BANK", "JAZZCASH", "EASYPAISA"]),
  transactionId: z.string().trim().max(80).optional().or(z.literal("")),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
});

export type DonationNotifyInput = z.infer<typeof donationNotifySchema>;

export const donateSettingsSchema = z
  .object({
    bank: z.object({
      enabled: z.boolean(),
      bankName: z.string().trim(),
      accountTitle: z.string().trim(),
      accountNumber: z.string().trim(),
      iban: z.string().trim(),
      branch: z.string().trim(),
    }),
    jazzcash: z.object({
      enabled: z.boolean(),
      accountName: z.string().trim(),
      mobileNumber: z.string().trim(),
    }),
    easypaisa: z.object({
      enabled: z.boolean(),
      accountName: z.string().trim(),
      mobileNumber: z.string().trim(),
    }),
    note: z.string().trim(),
  })
  .superRefine((value, ctx) => {
    if (value.bank.enabled) {
      if (!value.bank.accountTitle) {
        ctx.addIssue({
          code: "custom",
          message: "Bank account title is required when bank transfer is enabled",
          path: ["bank", "accountTitle"],
        });
      }
      if (!value.bank.accountNumber && !value.bank.iban) {
        ctx.addIssue({
          code: "custom",
          message: "Enter a bank account number or IBAN",
          path: ["bank", "accountNumber"],
        });
      }
    }

    if (value.jazzcash.enabled) {
      if (!value.jazzcash.accountName) {
        ctx.addIssue({
          code: "custom",
          message: "JazzCash account name is required",
          path: ["jazzcash", "accountName"],
        });
      }
      const mobile = mobileSchema.safeParse(value.jazzcash.mobileNumber);
      if (!mobile.success) {
        ctx.addIssue({
          code: "custom",
          message: mobile.error.issues[0]?.message || "Invalid JazzCash mobile",
          path: ["jazzcash", "mobileNumber"],
        });
      }
    }

    if (value.easypaisa.enabled) {
      if (!value.easypaisa.accountName) {
        ctx.addIssue({
          code: "custom",
          message: "EasyPaisa account name is required",
          path: ["easypaisa", "accountName"],
        });
      }
      const mobile = mobileSchema.safeParse(value.easypaisa.mobileNumber);
      if (!mobile.success) {
        ctx.addIssue({
          code: "custom",
          message:
            mobile.error.issues[0]?.message || "Invalid EasyPaisa mobile",
          path: ["easypaisa", "mobileNumber"],
        });
      }
    }
  });
