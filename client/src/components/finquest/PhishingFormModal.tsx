import { useState } from "react";
import { Lock, X, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface Field {
  id: string;
  label: string;
  placeholder: string;
  type: string;
}

interface FormConfig {
  siteTitle: string;
  siteDomain: string;
  headerColor: string;
  submitLabel: string;
  fields: Field[];
}

const FORM_CONFIGS: Record<string, FormConfig> = {
  phishing_bank: {
    siteTitle: "BankSecure Online Portal",
    siteDomain: "banksecure-support.ru",
    headerColor: "from-blue-900 to-blue-700",
    submitLabel: "Verify & Restore Access",
    fields: [
      { id: "username", label: "Online Banking Username", placeholder: "Enter your username", type: "text" },
      { id: "password", label: "Password", placeholder: "••••••••", type: "password" },
      { id: "cardNumber", label: "Card Number", placeholder: "1234 5678 9012 3456", type: "text" },
      { id: "cvv", label: "CVV / Security Code", placeholder: "•••", type: "password" },
    ],
  },
  account_verification: {
    siteTitle: "FreelancePay Security Center",
    siteDomain: "freelancepay-security.com",
    headerColor: "from-indigo-900 to-indigo-700",
    submitLabel: "Re-verify & Release Payment",
    fields: [
      { id: "email", label: "Account Email", placeholder: "you@example.com", type: "email" },
      { id: "paypalEmail", label: "PayPal Email", placeholder: "paypal@example.com", type: "email" },
      { id: "bankAccount", label: "Bank Account Number", placeholder: "1234567890", type: "text" },
      { id: "routingNumber", label: "Routing Number", placeholder: "021000021", type: "text" },
    ],
  },
  phishing_grant: {
    siteTitle: "Ministry of Education Assistance Portal",
    siteDomain: "ministry-edu-assistance.net",
    headerColor: "from-emerald-900 to-emerald-700",
    submitLabel: "Submit & Claim My $3,500 Grant",
    fields: [
      { id: "fullName", label: "Full Legal Name", placeholder: "John Smith", type: "text" },
      { id: "nationalId", label: "National ID / SSN", placeholder: "XXX-XX-XXXX", type: "text" },
      { id: "bankAccount", label: "Bank Account Number (for direct deposit)", placeholder: "1234567890", type: "text" },
      { id: "routingNumber", label: "Routing Number", placeholder: "021000021", type: "text" },
    ],
  },
  tax_refund: {
    siteTitle: "National Revenue Service — Refund Portal",
    siteDomain: "national-revenue-service.org",
    headerColor: "from-slate-800 to-slate-700",
    submitLabel: "Verify Identity & Claim Refund",
    fields: [
      { id: "fullName", label: "Full Legal Name", placeholder: "John Smith", type: "text" },
      { id: "taxId", label: "Tax ID / SSN", placeholder: "XXX-XX-XXXX", type: "text" },
      { id: "bankAccount", label: "Bank Account for Refund Deposit", placeholder: "1234567890", type: "text" },
      { id: "routingNumber", label: "Bank Routing Number", placeholder: "021000021", type: "text" },
    ],
  },
  prize_notification: {
    siteTitle: "Amazon Gifts & Promotions",
    siteDomain: "amazongifts-promo.net",
    headerColor: "from-orange-800 to-orange-600",
    submitLabel: "Complete Survey & Claim My $500",
    fields: [
      { id: "fullName", label: "Your Name", placeholder: "John Smith", type: "text" },
      { id: "email", label: "Email Address", placeholder: "you@example.com", type: "email" },
      { id: "cardNumber", label: "Credit Card (identity verification only)", placeholder: "1234 5678 9012 3456", type: "text" },
      { id: "cvv", label: "CVV", placeholder: "•••", type: "password" },
    ],
  },
  salary_update: {
    siteTitle: "HR Payroll Management System",
    siteDomain: "company-hr-portal.co",
    headerColor: "from-gray-800 to-gray-700",
    submitLabel: "Save New Payroll Details",
    fields: [
      { id: "employeeId", label: "Employee ID", placeholder: "EMP-12345", type: "text" },
      { id: "bankName", label: "Bank Name", placeholder: "Chase Bank", type: "text" },
      { id: "accountNumber", label: "Account Number", placeholder: "1234567890", type: "text" },
      { id: "routingNumber", label: "Routing Number", placeholder: "021000021", type: "text" },
    ],
  },
  investment_scam: {
    siteTitle: "VaultProfitBot — Investment Platform",
    siteDomain: "vaultprofitbot.com",
    headerColor: "from-violet-900 to-violet-700",
    submitLabel: "Activate My Account & Invest",
    fields: [
      { id: "fullName", label: "Full Name", placeholder: "John Smith", type: "text" },
      { id: "email", label: "Email Address", placeholder: "you@example.com", type: "email" },
      { id: "cardNumber", label: "Card Number (for initial deposit)", placeholder: "1234 5678 9012 3456", type: "text" },
      { id: "investAmount", label: "Initial Investment Amount ($)", placeholder: "500", type: "number" },
    ],
  },
};

const DEFAULT_CONFIG: FormConfig = {
  siteTitle: "Secure Portal",
  siteDomain: "secure-portal.com",
  headerColor: "from-gray-800 to-gray-700",
  submitLabel: "Submit",
  fields: [
    { id: "username", label: "Username", placeholder: "Enter username", type: "text" },
    { id: "password", label: "Password", placeholder: "••••••••", type: "password" },
  ],
};

interface Props {
  scenarioType: string;
  onSubmit: () => void;
  onClose: () => void;
}

export function PhishingFormModal({ scenarioType, onSubmit, onClose }: Props) {
  const config = FORM_CONFIGS[scenarioType] ?? DEFAULT_CONFIG;
  const [values, setValues] = useState<Record<string, string>>({});

  const allFilled = config.fields.every(f => (values[f.id] ?? "").trim().length > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md mx-4 rounded-2xl overflow-hidden shadow-2xl">
        {/* Fake site header */}
        <div className={cn("bg-gradient-to-r px-5 py-4 text-white flex items-center justify-between", config.headerColor)}>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 opacity-80" />
            <div>
              <div className="font-bold text-sm">{config.siteTitle}</div>
              <div className="text-[10px] opacity-60">{config.siteDomain}</div>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Form body */}
        <div className="bg-white dark:bg-zinc-900 p-6">
          <div className="space-y-4">
            {config.fields.map(field => (
              <div key={field.id}>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  value={values[field.id] ?? ""}
                  onChange={e => setValues(v => ({ ...v, [field.id]: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            ))}
          </div>

          <button
            onClick={onSubmit}
            disabled={!allFilled}
            className="mt-6 w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold text-sm transition-colors"
          >
            {config.submitLabel}
          </button>

          {/* Fake trust badges */}
          <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-gray-400">
            <ShieldCheck className="w-3 h-3" />
            <span>Secured with TLS 1.3 · 256-bit encryption</span>
          </div>
        </div>
      </div>
    </div>
  );
}
