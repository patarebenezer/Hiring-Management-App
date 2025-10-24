import { SalaryRange } from "@/types";
import dayjs from "dayjs";

export const formatCurrency = (n: number, currency: string) => {
 try {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency }).format(
   n
  );
 } catch {
  return `Rp${n.toLocaleString("id-ID")}`;
 }
};

export const salaryText = (range: SalaryRange) => {
 const { min, max, currency } = range;
 return `${formatCurrency(min, currency)} - ${formatCurrency(max, currency)}`;
};

export const formatDate = (iso: string) =>
 dayjs(iso).format("DD MMM YYYY HH:mm");
