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

export const applicationFormSchema = z.object({
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
  feeAmount: z.coerce.number().positive("Fee amount must be greater than 0"),
  incomeInfo: z.string().trim().min(5, "Income information is required"),
  hasDisability: z.coerce.boolean(),
  disabilityInfo: z.string().trim().optional(),
  declaration: z.boolean().refine((value) => value === true, {
    message: "You must accept the declaration",
  }),
});

export type ApplicationFormInput = z.infer<typeof applicationFormSchema>;
