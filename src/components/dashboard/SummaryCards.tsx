import { formatCurrency, formatNumber } from "@/lib/formatters";

type Card = {
  label: string;
  value: string;
  icon: string;
  note: string;
};

export function SummaryCards({
  productCount,
  currentStock,
  todaySales,
  lowStockCount,
}: {
  productCount: number;
  currentStock: number;
  todaySales: number;
  lowStockCount: number;
}) {
  const cards: Card[] = [
    {
      label: "Total products",
      value: formatNumber(productCount),
      icon: "▦",
      note: "Items in your catalogue",
    },
    {
      label: "Current stock",
      value: formatNumber(currentStock),
      icon: "◈",
      note: "Total units on hand",
    },
    {
      label: "Today's sales",
      value: formatCurrency(todaySales),
      icon: "↗",
      note: "Recorded since midnight",
    },
    {
      label: "Low stock",
      value: formatNumber(lowStockCount),
      icon: "!",
      note: lowStockCount > 0 ? "Needs your attention" : "Inventory looks healthy",
    },
  ];

  return (
    <section className="grid">
      {cards.map((card) => (
        <article className="card" key={card.label}>
          <div className="metric-head">
            <span>{card.label}</span>
            <span className="metric-icon">{card.icon}</span>
          </div>
          <div className="metric">{card.value}</div>
          <span className="trend neutral">{card.note}</span>
        </article>
      ))}
    </section>
  );
}