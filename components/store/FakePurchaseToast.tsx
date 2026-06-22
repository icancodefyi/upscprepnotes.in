"use client";

import { useState, useEffect, useCallback } from "react";
import { IconShoppingBag } from "@tabler/icons-react";

const NAMES = [
  "Ankit", "Priya", "Rahul", "Neha", "Vikram", "Pooja", "Amit", "Sneha",
  "Rajesh", "Kavita", "Sunil", "Deepika", "Manish", "Anjali", "Arun",
  "Swati", "Nitin", "Ritu", "Sachin", "Meera", "Gaurav", "Nandini",
];

const CITIES = [
  "Mumbai", "Delhi", "Bangalore", "Pune", "Hyderabad", "Chennai",
  "Kolkata", "Ahmedabad", "Jaipur", "Lucknow", "Patna", "Bhopal",
  "Chandigarh", "Indore", "Nagpur", "Surat", "Thane", "Varanasi",
];

const ACTIVE_PRODUCTS = [
  "Answer Copies Compilation",
  "All Strategy Reports",
  "Top 10 Rankers Strategy",
  "Places in News",
  "Government Schemes Compilation",
  "Complete GS Notes Bundle",
  "Anthropology Optional Bundle",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInterval(): number {
  return 8000 + Math.random() * 20000;
}

export default function FakePurchaseToast() {
  const [toasts, setToasts] = useState<{ id: number; name: string; city: string; product: string }[]>([]);

  const addToast = useCallback(() => {
    const toast = {
      id: Date.now(),
      name: pick(NAMES),
      city: pick(CITIES),
      product: pick(ACTIVE_PRODUCTS),
    };
    setToasts((prev) => [...prev.slice(-2), toast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== toast.id));
    }, 5000);
  }, []);

  useEffect(() => {
    const show = setTimeout(addToast, 3000);
    const interval = setInterval(addToast, randomInterval());
    return () => {
      clearTimeout(show);
      clearInterval(interval);
    };
  }, [addToast]);

  return (
    <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-2 max-w-[280px] pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="animate-in slide-in-from-left-8 fade-in duration-500 rounded-xl border border-gray-100 bg-white px-3 py-2.5 shadow-lg"
        >
          <div className="flex items-start gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-50">
              <IconShoppingBag size={13} className="text-emerald-600" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-gray-900 leading-tight">
                {toast.name} from <strong>{toast.city}</strong>
              </p>
              <p className="text-[10px] text-gray-500 leading-tight mt-0.5">
                purchased <strong className="text-emerald-700">{toast.product}</strong>
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
