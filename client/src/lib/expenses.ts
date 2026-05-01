import {
  Wifi, Zap, Phone, Tv, Home,
  Bus, Wrench, Music, Dumbbell, Package, Film, Coffee, Gamepad2, ShoppingCart,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Persona } from "@/lib/api";

export interface Expense {
  id: string;
  label: string;
  amount: number;
  icon: LucideIcon;
  mandatory: boolean;
}

export const EXPENSES: Record<Persona, Expense[]> = {
  student: [
    { id: "rent",        label: "Rent",           amount: 600,   icon: Home,         mandatory: true  },
    { id: "electricity", label: "Electricity",    amount: 40,    icon: Zap,          mandatory: true  },
    { id: "internet",    label: "Internet",       amount: 65,    icon: Wifi,         mandatory: true  },
    { id: "phone",       label: "Phone Plan",     amount: 30,    icon: Phone,        mandatory: true  },
    { id: "groceries",   label: "Groceries",      amount: 200,   icon: ShoppingCart, mandatory: true  },
    { id: "netflix",     label: "Netflix",        amount: 15.99, icon: Tv,           mandatory: false },
    { id: "spotify",     label: "Spotify",        amount: 9.99,  icon: Music,        mandatory: false },
    { id: "gym",         label: "Gym",            amount: 29.99, icon: Dumbbell,     mandatory: false },
    { id: "amazon",      label: "Amazon Prime",   amount: 14.99, icon: Package,      mandatory: false },
    { id: "gaming",      label: "Gaming Pass",    amount: 14.99, icon: Gamepad2,     mandatory: false },
  ],
  employee: [
    { id: "rent",        label: "Rent",           amount: 1200,  icon: Home,         mandatory: true  },
    { id: "electricity", label: "Electricity",    amount: 80,    icon: Zap,          mandatory: true  },
    { id: "internet",    label: "Internet",       amount: 65,    icon: Wifi,         mandatory: true  },
    { id: "phone",       label: "Phone Plan",     amount: 50,    icon: Phone,        mandatory: true  },
    { id: "groceries",   label: "Groceries",      amount: 400,   icon: ShoppingCart, mandatory: true  },
    { id: "transport",   label: "Transport",      amount: 120,   icon: Bus,          mandatory: true  },
    { id: "netflix",     label: "Netflix",        amount: 15.99, icon: Tv,           mandatory: false },
    { id: "spotify",     label: "Spotify",        amount: 9.99,  icon: Music,        mandatory: false },
    { id: "gym",         label: "Gym",            amount: 49.99, icon: Dumbbell,     mandatory: false },
    { id: "amazon",      label: "Amazon Prime",   amount: 14.99, icon: Package,      mandatory: false },
    { id: "disney",      label: "Disney+",        amount: 13.99, icon: Film,         mandatory: false },
    { id: "coffee",      label: "Coffee Shop",    amount: 60,    icon: Coffee,       mandatory: false },
  ],
  freelancer: [
    { id: "rent",        label: "Rent",           amount: 1000,  icon: Home,         mandatory: true  },
    { id: "electricity", label: "Electricity",    amount: 70,    icon: Zap,          mandatory: true  },
    { id: "internet",    label: "Internet",       amount: 65,    icon: Wifi,         mandatory: true  },
    { id: "phone",       label: "Phone Plan",     amount: 45,    icon: Phone,        mandatory: true  },
    { id: "groceries",   label: "Groceries",      amount: 350,   icon: ShoppingCart, mandatory: true  },
    { id: "tools",       label: "Software Tools", amount: 50,    icon: Wrench,       mandatory: true  },
    { id: "netflix",     label: "Netflix",        amount: 15.99, icon: Tv,           mandatory: false },
    { id: "spotify",     label: "Spotify",        amount: 9.99,  icon: Music,        mandatory: false },
    { id: "gym",         label: "Gym",            amount: 39.99, icon: Dumbbell,     mandatory: false },
    { id: "amazon",      label: "Amazon Prime",   amount: 14.99, icon: Package,      mandatory: false },
    { id: "coffee",      label: "Coffee Shop",    amount: 45,    icon: Coffee,       mandatory: false },
  ],
};

export function calcExpenses(
  persona: Persona,
  optionalOff: Set<string>
): { mandatoryTotal: number; optionalTotal: number; grandTotal: number } {
  const list = EXPENSES[persona];
  const mandatoryTotal = list.filter(e => e.mandatory).reduce((s, e) => s + e.amount, 0);
  const optionalTotal  = list.filter(e => !e.mandatory && !optionalOff.has(e.id)).reduce((s, e) => s + e.amount, 0);
  return { mandatoryTotal, optionalTotal, grandTotal: mandatoryTotal + optionalTotal };
}
