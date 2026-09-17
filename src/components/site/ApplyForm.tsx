"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { FormEvent, useState } from "react";
import { CopyButton } from "@/components/site/CopyButton";
import { formatCnic, formatMobile } from "@/lib/validations";

const FILE_ACCEPT =
  ".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp";

export function ApplyForm() {
  const t = useTranslations("apply");
  const locale = useLocale();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successRef, setSuccessRef] = useState<string | null>(null);
  const [hasDisability, setHasDisability] = useState(false);
  const [cnic, setCnic] = useState("");
  const [mobile, setMobile] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || t("submitFailed"));
      }
      setSuccessRef(data.referenceNo);
      form.reset();
      setHasDisability(false);
      setCnic("");
      setMobile("");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("submitFailed"));
    } finally {
      setLoading(false);
    }
  }

  if (successRef) {
    return (
      <div className="surface-card bg-brand-green-soft p-6 sm:p-8">
        <p className="text-brand-green font-medium text-lg leading-relaxed">
          {t("success", { ref: successRef })}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <p className="font-mono text-sm font-semibold text-brand-green-deep">
            {successRef}
          </p>
          <CopyButton
            value={successRef}
            label={t("copy")}
            copiedLabel={t("copied")}
          />
        </div>
        <p className="mt-4 text-sm text-brand-muted leading-relaxed">
          {t("successHint")}
        </p>
        <p className="mt-2 text-sm text-brand-muted leading-relaxed">
          {t("emailReceiptHint")}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href={`/${locale}/status`} className="btn-donate">
            {t("checkStatus")}
          </Link>
          <button
            type="button"
            className="btn-outline"
            onClick={() => setSuccessRef(null)}
          >
            {t("submitAnother")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8" encType="multipart/form-data">
      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <fieldset className="space-y-4">
        <legend className="font-display text-xl text-brand-green font-semibold mb-1">
          {t("sectionApplicant")}
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="field sm:col-span-2">
            <label htmlFor="applicantType">{t("applicantType")}</label>
            <select
              id="applicantType"
              name="applicantType"
              required
              defaultValue="GUARDIAN"
            >
              <option value="STUDENT">{t("student")}</option>
              <option value="GUARDIAN">{t("guardian")}</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="fullName">{t("fullName")}</label>
            <input id="fullName" name="fullName" required minLength={3} />
          </div>
          <div className="field">
            <label htmlFor="guardianName">{t("guardianName")}</label>
            <input id="guardianName" name="guardianName" required minLength={3} />
          </div>
          <div className="field">
            <label htmlFor="cnic">{t("cnic")}</label>
            <input
              id="cnic"
              name="cnic"
              required
              inputMode="numeric"
              placeholder="XXXXX-XXXXXXX-X"
              value={cnic}
              onChange={(e) => setCnic(formatCnic(e.target.value))}
            />
          </div>
          <div className="field">
            <label htmlFor="mobile">{t("mobile")}</label>
            <input
              id="mobile"
              name="mobile"
              required
              inputMode="numeric"
              placeholder="03XXXXXXXXX"
              value={mobile}
              onChange={(e) => setMobile(formatMobile(e.target.value))}
            />
          </div>
          <div className="field">
            <label htmlFor="email">{t("email")}</label>
            <input id="email" name="email" type="email" />
            <p className="mt-1 text-xs text-brand-muted">{t("emailHint")}</p>
          </div>
          <div className="field">
            <label htmlFor="city">{t("city")}</label>
            <input id="city" name="city" required />
          </div>
          <div className="field sm:col-span-2">
            <label htmlFor="address">{t("address")}</label>
            <textarea id="address" name="address" rows={2} required />
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="font-display text-xl text-brand-green font-semibold mb-1">
          {t("sectionSchool")}
        </legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="field">
            <label htmlFor="schoolName">{t("schoolName")}</label>
            <input id="schoolName" name="schoolName" required />
          </div>
          <div className="field">
            <label htmlFor="classGrade">{t("classGrade")}</label>
            <input id="classGrade" name="classGrade" required />
          </div>
          <div className="field sm:col-span-2">
            <label htmlFor="schoolAddress">{t("schoolAddress")}</label>
            <textarea id="schoolAddress" name="schoolAddress" rows={2} required />
          </div>
          <div className="field">
            <label htmlFor="previousMarks">{t("previousMarks")}</label>
            <input id="previousMarks" name="previousMarks" required />
          </div>
          <div className="field">
            <label htmlFor="feeAmount">{t("feeAmount")}</label>
            <input
              id="feeAmount"
              name="feeAmount"
              type="number"
              min={1}
              max={5000000}
              step="1"
              required
            />
          </div>
          <div className="field sm:col-span-2">
            <label htmlFor="incomeInfo">{t("incomeInfo")}</label>
            <textarea id="incomeInfo" name="incomeInfo" rows={3} required />
          </div>
          <div className="field">
            <label htmlFor="hasDisability">{t("hasDisability")}</label>
            <select
              id="hasDisability"
              name="hasDisability"
              value={hasDisability ? "true" : "false"}
              onChange={(e) => setHasDisability(e.target.value === "true")}
            >
              <option value="false">{t("no")}</option>
              <option value="true">{t("yes")}</option>
            </select>
          </div>
          {hasDisability ? (
            <div className="field">
              <label htmlFor="disabilityInfo">{t("disabilityInfo")}</label>
              <input id="disabilityInfo" name="disabilityInfo" required />
            </div>
          ) : (
            <input type="hidden" name="disabilityInfo" value="" />
          )}
        </div>
      </fieldset>

      <fieldset className="space-y-4">
        <legend className="font-display text-xl text-brand-green font-semibold mb-1">
          {t("requiredDocs")}
        </legend>
        <p className="text-xs text-brand-muted">{t("docsHint")}</p>
        <div className="grid gap-4 sm:grid-cols-1">
          <div className="field">
            <label htmlFor="feeChallan">{t("feeChallan")}</label>
            <input
              id="feeChallan"
              name="feeChallan"
              type="file"
              accept={FILE_ACCEPT}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="bForm">{t("bForm")}</label>
            <input
              id="bForm"
              name="bForm"
              type="file"
              accept={FILE_ACCEPT}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="incomeCert">{t("incomeCert")}</label>
            <input
              id="incomeCert"
              name="incomeCert"
              type="file"
              accept={FILE_ACCEPT}
              required
            />
          </div>
        </div>
      </fieldset>

      <label className="flex items-start gap-3 text-sm text-brand-muted rounded-xl bg-brand-green-soft/60 px-4 py-3">
        <input
          type="checkbox"
          name="declaration"
          value="true"
          required
          className="mt-1 accent-[var(--brand-green)]"
        />
        <span>{t("declaration")}</span>
      </label>

      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}
