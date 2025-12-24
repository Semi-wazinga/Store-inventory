import { useMemo } from "react";
import { useSales } from "../../context/useSales";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function SalesSummary() {
  const { allSales, sales, role, loading } = useSales();

  const salesToUse = role === "admin" ? allSales : sales;

  const summary = useMemo(() => {
    const now = new Date();
    const weekAgo = new Date(now);
    weekAgo.setDate(now.getDate() - 7);

    const base = {
      daily: { count: 0, qty: 0, revenue: 0 },
      weekly: { count: 0, qty: 0, revenue: 0 },
      monthly: { count: 0, qty: 0, revenue: 0 },
    };

    for (const s of salesToUse) {
      const d = new Date(s.createdAt);
      const price = Number(s.totalPrice) || 0;
      const qty = Number(s.quantity) || 0;

      if (d.toDateString() === now.toDateString()) {
        base.daily.count++;
        base.daily.qty += qty;
        base.daily.revenue += price;
      }

      if (d >= weekAgo) {
        base.weekly.count++;
        base.weekly.qty += qty;
        base.weekly.revenue += price;
      }

      if (
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
      ) {
        base.monthly.count++;
        base.monthly.qty += qty;
        base.monthly.revenue += price;
      }
    }

    return base;
  }, [salesToUse]);

  const chartData = useMemo(
    () => [
      {
        period: "Today",
        revenue: Number(summary.daily.revenue) || 0,
        qty: Number(summary.daily.qty) || 0,
      },
      {
        period: "7 Days",
        revenue: Number(summary.weekly.revenue) || 0,
        qty: Number(summary.weekly.qty) || 0,
      },
      {
        period: "This Month",
        revenue: Number(summary.monthly.revenue) || 0,
        qty: Number(summary.monthly.qty) || 0,
      },
    ],
    [summary]
  );

  if (loading) return null;

  const Card = ({ title, data }) => (
    <div className='col-md-4'>
      <div className='card shadow-sm'>
        <div className='card-body text-center'>
          <h6 className='text-muted'>{title}</h6>
          <h4>{data.count} sales</h4>
          <p className='mb-1'>Qty: {data.qty}</p>
          <strong>₦{data.revenue.toLocaleString()}</strong>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className='row g-3 mb-4'>
        <Card title='Today' data={summary.daily} />
        <Card title='Last 7 Days' data={summary.weekly} />
        <Card title='This Month' data={summary.monthly} />
      </div>

      <div className='row g-4'>
        <div className='col-md-6'>
          <div className='card shadow-sm p-3'>
            <h6 className='mb-3'>Revenue Summary</h6>
            <ResponsiveContainer width='100%' height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='period' />
                <YAxis />
                <Tooltip />
                <Bar dataKey='revenue' />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className='col-md-6'>
          <div className='card shadow-sm p-3'>
            <h6 className='mb-3'>Quantity Sold</h6>
            <ResponsiveContainer width='100%' height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='period' />
                <YAxis />
                <Tooltip />
                <Line dataKey='qty' />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
}
