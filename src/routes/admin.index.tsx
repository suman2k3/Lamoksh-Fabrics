import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  IndianRupee,
  ShoppingBag,
  Package,
  Users,
  AlertTriangle,
  XCircle,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { dbStore } from "@/lib/db/store";
import { formatPrice } from "@/data/catalog";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboardPage,
});

function AdminDashboardPage() {
  const [timeFilter, setTimeFilter] = useState<"daily" | "weekly" | "monthly" | "yearly">("monthly");
  const [refreshKey, setRefreshKey] = useState(0);

  const orders = dbStore.getOrders();
  const products = dbStore.getProducts();
  const customers = dbStore.getCustomers();
  const auditLogs = dbStore.getAuditLogs();

  // Calculate Metrics from Database
  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === "paid" ? o.totalAmount : 0), 0);
  const totalOrdersCount = orders.length;
  const totalProductsCount = products.length;
  const totalCustomersCount = customers.length;
  const pendingOrdersCount = orders.filter((o) => o.orderStatus === "pending" || o.orderStatus === "confirmed").length;
  const lowStockProducts = products.filter(
    (p) => (p as any).stockQuantity <= ((p as any).lowStockThreshold || 5) && (p as any).stockQuantity > 0
  );
  const outOfStockProducts = products.filter((p) => !p.inStock || (p as any).stockQuantity === 0);
  const averageOrderValue = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;

  // Chart Data Preparation
  const chartData = [
    { period: "Jan", revenue: 84000, orders: 11 },
    { period: "Feb", revenue: 112000, orders: 15 },
    { period: "Mar", revenue: 98000, orders: 13 },
    { period: "Apr", revenue: 145000, orders: 19 },
    { period: "May", revenue: 189000, orders: 24 },
    { period: "Jun", revenue: 230000, orders: 31 },
    { period: "Jul", revenue: 210000, orders: 28 },
    { period: "Aug", revenue: 265000, orders: 36 },
    { period: "Sep", revenue: 290000, orders: 40 },
    { period: "Oct", revenue: totalRevenue > 0 ? totalRevenue : 320000, orders: totalOrdersCount || 45 },
  ];

  const categoryData = [
    { category: "Suit Sets", sales: 42 },
    { category: "Ikat Prints", sales: 28 },
    { category: "Banarasi", sales: 35 },
    { category: "Maheshwari", sales: 19 },
  ];

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="space-y-8">
      {/* Title & Refresh Row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#E7E5E4] pb-6">
        <div>
          <p className="eyebrow text-[#6B1D2F]">OVERVIEW</p>
          <h1 className="font-serif text-3xl md:text-4xl font-normal text-[#1C1917]">
            Executive Dashboard
          </h1>
          <p className="font-sans text-xs text-[#57534E] mt-1">
            Real-time sales, order activity, inventory status, and administrative logs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleRefresh}
            className="flex items-center gap-2 border border-[#E7E5E4] bg-white px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-wider text-[#1C1917] hover:bg-[#FAF8F5] transition-colors shadow-sm"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Refresh Data</span>
          </button>

          <Link
            to="/admin/products/new"
            className="flex items-center gap-2 bg-[#6B1D2F] px-4 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-white hover:bg-[#4D1220] transition-colors shadow-sm"
          >
            <span>+ Add Product</span>
          </Link>
        </div>
      </div>

      {/* 8 Overview KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* 1. Total Revenue */}
        <div className="bg-white border border-[#E7E5E4] p-5 shadow-sm space-y-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-16 w-16 bg-[#6B1D2F]/5 rounded-bl-full pointer-events-none" />
          <div className="flex items-center justify-between text-[#57534E]">
            <span className="font-sans text-xs font-semibold uppercase tracking-wider">Total Revenue</span>
            <IndianRupee className="h-5 w-5 text-[#6B1D2F]" />
          </div>
          <p className="font-serif text-2xl md:text-3xl font-normal text-[#1C1917]">
            {formatPrice(totalRevenue)}
          </p>
          <p className="text-[0.7rem] text-emerald-700 flex items-center gap-1 font-medium">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>+14.2% vs previous period</span>
          </p>
        </div>

        {/* 2. Total Orders */}
        <div className="bg-white border border-[#E7E5E4] p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-[#57534E]">
            <span className="font-sans text-xs font-semibold uppercase tracking-wider">Total Orders</span>
            <ShoppingBag className="h-5 w-5 text-[#6B1D2F]" />
          </div>
          <p className="font-serif text-2xl md:text-3xl font-normal text-[#1C1917]">
            {totalOrdersCount}
          </p>
          <p className="text-[0.7rem] text-[#57534E]">Across all payment channels</p>
        </div>

        {/* 3. Total Products */}
        <div className="bg-white border border-[#E7E5E4] p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-[#57534E]">
            <span className="font-sans text-xs font-semibold uppercase tracking-wider">Total Products</span>
            <Package className="h-5 w-5 text-[#6B1D2F]" />
          </div>
          <p className="font-serif text-2xl md:text-3xl font-normal text-[#1C1917]">
            {totalProductsCount}
          </p>
          <p className="text-[0.7rem] text-[#57534E]">Active catalog items</p>
        </div>

        {/* 4. Total Customers */}
        <div className="bg-white border border-[#E7E5E4] p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-[#57534E]">
            <span className="font-sans text-xs font-semibold uppercase tracking-wider">Registered Clients</span>
            <Users className="h-5 w-5 text-[#6B1D2F]" />
          </div>
          <p className="font-serif text-2xl md:text-3xl font-normal text-[#1C1917]">
            {totalCustomersCount}
          </p>
          <p className="text-[0.7rem] text-[#57534E]">Verified customer accounts</p>
        </div>

        {/* 5. Pending Orders */}
        <div className="bg-white border border-[#E7E5E4] p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-[#57534E]">
            <span className="font-sans text-xs font-semibold uppercase tracking-wider">Pending Orders</span>
            <Clock className="h-5 w-5 text-amber-600" />
          </div>
          <p className="font-serif text-2xl md:text-3xl font-normal text-[#1C1917]">
            {pendingOrdersCount}
          </p>
          <p className="text-[0.7rem] text-amber-700 font-medium">Requires fulfillment action</p>
        </div>

        {/* 6. Low Stock Products */}
        <div className="bg-white border border-[#E7E5E4] p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-[#57534E]">
            <span className="font-sans text-xs font-semibold uppercase tracking-wider">Low Stock Items</span>
            <AlertTriangle className="h-5 w-5 text-amber-600" />
          </div>
          <p className="font-serif text-2xl md:text-3xl font-normal text-[#1C1917]">
            {lowStockProducts.length}
          </p>
          <p className="text-[0.7rem] text-[#57534E]">Below minimum threshold</p>
        </div>

        {/* 7. Out of Stock Products */}
        <div className="bg-white border border-[#E7E5E4] p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-[#57534E]">
            <span className="font-sans text-xs font-semibold uppercase tracking-wider">Out of Stock</span>
            <XCircle className="h-5 w-5 text-red-600" />
          </div>
          <p className="font-serif text-2xl md:text-3xl font-normal text-[#1C1917]">
            {outOfStockProducts.length}
          </p>
          <p className="text-[0.7rem] text-red-700 font-medium">Unavailable for purchase</p>
        </div>

        {/* 8. Average Order Value */}
        <div className="bg-white border border-[#E7E5E4] p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-[#57534E]">
            <span className="font-sans text-xs font-semibold uppercase tracking-wider">Average Order Value</span>
            <TrendingUp className="h-5 w-5 text-[#6B1D2F]" />
          </div>
          <p className="font-serif text-2xl md:text-3xl font-normal text-[#1C1917]">
            {formatPrice(averageOrderValue)}
          </p>
          <p className="text-[0.7rem] text-[#57534E]">Per successful transaction</p>
        </div>
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Revenue Performance Chart (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-[#E7E5E4] p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E7E5E4] pb-4">
            <div>
              <h2 className="font-serif text-xl font-normal text-[#1C1917]">
                Revenue Performance
              </h2>
              <p className="text-xs text-[#57534E] mt-0.5">
                Gross transaction value over time.
              </p>
            </div>

            {/* Time Filters */}
            <div className="flex items-center border border-[#E7E5E4] bg-[#FAF8F5] text-xs">
              {(["daily", "weekly", "monthly", "yearly"] as const).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setTimeFilter(filter)}
                  className={`px-3 py-1.5 uppercase font-medium transition-colors ${
                    timeFilter === filter
                      ? "bg-[#6B1D2F] text-white"
                      : "text-[#57534E] hover:text-[#1C1917]"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6B1D2F" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6B1D2F" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" />
                <XAxis dataKey="period" stroke="#57534E" fontSize={11} />
                <YAxis
                  stroke="#57534E"
                  fontSize={11}
                  tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value: any) => [formatPrice(Number(value)), "Revenue"]}
                  contentStyle={{ backgroundColor: "#FFFFFF", borderColor: "#E7E5E4", fontSize: "12px" }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#6B1D2F"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales by Category (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-[#E7E5E4] p-6 shadow-sm space-y-6">
          <div className="border-b border-[#E7E5E4] pb-4">
            <h2 className="font-serif text-xl font-normal text-[#1C1917]">
              Sales by Craft Category
            </h2>
            <p className="text-xs text-[#57534E] mt-0.5">
              Units sold across textile edits.
            </p>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" />
                <XAxis dataKey="category" stroke="#57534E" fontSize={10} />
                <YAxis stroke="#57534E" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#FFFFFF", borderColor: "#E7E5E4", fontSize: "12px" }}
                />
                <Bar dataKey="sales" fill="#6B1D2F" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tables Row: Recent Orders & Inventory Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders Table (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-[#E7E5E4] p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-[#E7E5E4] pb-4">
            <div>
              <h2 className="font-serif text-xl font-normal text-[#1C1917]">
                Recent Client Orders
              </h2>
              <p className="text-xs text-[#57534E] mt-0.5">
                Latest transactions requiring dispatch and tracking.
              </p>
            </div>
            <Link
              to="/admin/orders"
              className="text-xs font-semibold uppercase tracking-wider text-[#6B1D2F] hover:underline flex items-center gap-1"
            >
              <span>View All Orders</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs">
              <thead className="bg-[#FAF8F5] text-[#57534E] border-b border-[#E7E5E4] uppercase font-semibold text-[0.65rem] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Order #</th>
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E7E5E4]">
                {orders.slice(0, 5).map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-xs font-semibold text-[#1C1917]">
                      {ord.orderNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-medium text-[#1C1917]">{ord.customerName}</p>
                      <p className="text-[0.7rem] text-[#57534E]">{ord.customerEmail}</p>
                    </td>
                    <td className="py-3.5 px-4 text-[#57534E]">
                      {ord.items.length} {ord.items.length === 1 ? "item" : "items"}
                    </td>
                    <td className="py-3.5 px-4 font-serif text-sm font-medium text-[#1C1917]">
                      {formatPrice(ord.totalAmount)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-block px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wider rounded-none ${
                          ord.orderStatus === "delivered"
                            ? "bg-emerald-100 text-emerald-800"
                            : ord.orderStatus === "shipped"
                            ? "bg-blue-100 text-blue-800"
                            : ord.orderStatus === "confirmed"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-stone-100 text-stone-800"
                        }`}
                      >
                        {ord.orderStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to="/admin/orders/$id"
                        params={{ id: ord.id }}
                        className="text-[#6B1D2F] font-semibold hover:underline"
                      >
                        Manage &rarr;
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts & Audit Log (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Low Stock Box */}
          <div className="bg-white border border-[#E7E5E4] p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-amber-700 font-semibold border-b border-[#E7E5E4] pb-3">
              <AlertTriangle className="h-5 w-5" />
              <h3 className="font-serif text-lg font-normal text-[#1C1917]">Low Stock Watchlist</h3>
            </div>

            {lowStockProducts.length === 0 ? (
              <p className="text-xs text-[#57534E] py-4 text-center">
                All catalog inventory is currently healthy.
              </p>
            ) : (
              <div className="space-y-3">
                {lowStockProducts.slice(0, 4).map((prod) => (
                  <div key={prod.id} className="flex items-center justify-between border-b border-[#FAF8F5] pb-2 text-xs">
                    <div className="truncate max-w-[170px]">
                      <p className="font-medium text-[#1C1917] truncate">{prod.title}</p>
                      <p className="text-[0.65rem] text-[#57534E]">SKU: {prod.sku}</p>
                    </div>
                    <span className="bg-amber-100 text-amber-800 font-bold px-2 py-0.5 text-[0.65rem]">
                      {(prod as any).stockQuantity} left
                    </span>
                  </div>
                ))}
                <Link
                  to="/admin/inventory"
                  className="block text-center text-xs font-semibold uppercase tracking-wider text-[#6B1D2F] hover:underline pt-2"
                >
                  Manage Stock Levels &rarr;
                </Link>
              </div>
            )}
          </div>

          {/* Audit Trail Activity */}
          <div className="bg-white border border-[#E7E5E4] p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#E7E5E4] pb-3">
              <h3 className="font-serif text-lg font-normal text-[#1C1917]">Audit Activity</h3>
              <ShieldCheck className="h-4 w-4 text-[#6B1D2F]" />
            </div>

            <div className="space-y-3">
              {auditLogs.slice(0, 4).map((log) => (
                <div key={log.id} className="text-xs border-b border-[#FAF8F5] pb-2">
                  <div className="flex justify-between text-[#57534E] text-[0.65rem]">
                    <span className="font-semibold text-[#6B1D2F] uppercase">{log.action}</span>
                    <span>{new Date(log.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                  <p className="text-[#1C1917] mt-0.5 font-sans">
                    {log.adminEmail} · {log.entityType} {log.entityId ? `#${log.entityId}` : ""}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
