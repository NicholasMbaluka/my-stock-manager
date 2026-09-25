import { STOCK_STATUS_LABEL, stockStatus } from "@/lib/calculations";

export function StockBadge({
  stock,
  threshold,
}: {
  stock: number;
  threshold: number;
}) {
  const status = stockStatus(stock, threshold);
  return (
    <span className={`tag ${status.toLowerCase().replace(/_/g, "-")}`}>
      {STOCK_STATUS_LABEL[status]}
    </span>
  );
}