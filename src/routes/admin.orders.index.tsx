import React, { useState, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { dbStore, Order } from "@/lib/db/store";
import {
  Search,
  Filter,
  Eye,
  Truck,
  CheckCircle,
  Clock,
  Package,
  XCircle,
  RefreshCw,
  ExternalLink,
} from "lucide-react";

export const Route = createFileRoute("/admin/orders/")({
  component: AdminOrdersPage,
});

function AdminOrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadOrders = () => {
    setOrders(dbStore.getOrders());
  };

  useEffect(() => {
    loadOrders();
    const handleDbUpdate = () => loadOrders();
    window.addEventListener("manmayi_db_updated", handleDbUpdate);
    return () => window.removeEventListener("manmayi_db_updated", handleDbUpdate);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.trackingNumber &&
        order.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      selectedStatus === "all" || order.orderStatus === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const handleQuickStatusUpdate = (
    orderId: string,
    newStatus: Order["orderStatus"]
  ) => {
    dbStore.updateOrderStatus(orderId, newStatus);
    loadOrders();
    showToast(`Order status updated to ${newStatus}.`);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#1C1917] text-white px-5 py-3 shadow-xl border-l-4 border-[#6B1D2F] flex items-center space-x-3 text-sm">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 border border-[#E7E5E4] shadow-sm">
        <div>
          <h1 className="text-2xl font-serif font-light text-[#1C1917]">
            Client Order Management
          </h1>
          <p className="text-xs text-[#78716C] mt-1 font-sans">
            Track order fulfillment, courier dispatches, invoices, and shipment tracking.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs text-[#78716C]">
          <span className="font-semibold text-[#1C1917]">{orders.length}</span> Total Orders Processed
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-6 border border-[#E7E5E4] shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#A8A29E]" />
            <input
              type="text"
              placeholder="Search by order number (e.g. MN-2026-1001), client name, email, tracking..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-[#E7E5E4] bg-[#FAF8F5] text-[#1C1917] focus:bg-white focus:outline-none focus:border-[#6B1D2F]"
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="py-2 px-3 text-xs border border-[#E7E5E4] bg-[#FAF8F5] text-[#1C1917] focus:bg-white focus:outline-none focus:border-[#6B1D2F]"
          >
            <option value="all">All Order Fulfillment Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing / Tailoring</option>
            <option value="packed">Packed for Courier</option>
            <option value="shipped">Shipped in Transit</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-[#E7E5E4] shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#FAF8F5] border-b border-[#E7E5E4] text-[11px] uppercase tracking-wider font-semibold text-[#78716C]">
              <th className="p-4">Order Number & Date</th>
              <th className="p-4">Client Details</th>
              <th className="p-4">Items Count</th>
              <th className="p-4">Total Amount</th>
              <th className="p-4">Payment</th>
              <th className="p-4">Fulfillment Pipeline</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E7E5E4] text-xs text-[#1C1917]">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-[#78716C]">
                  No orders found matching your search or filters.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => {
                return (
                  <tr key={order.id} className="hover:bg-[#FAF8F5]/60 transition-colors">
                    <td className="p-4">
                      <Link
                        to={`/admin/orders/$id` as any}
                        params={{ id: order.id } as any}
                        className="font-mono font-bold text-[#6B1D2F] hover:underline"
                      >
                        {order.orderNumber}
                      </Link>
                      <div className="text-[11px] text-[#78716C] mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="font-medium text-[#1C1917]">{order.customerName}</div>
                      <div className="text-[11px] text-[#78716C]">{order.customerEmail}</div>
                      <div className="text-[11px] text-[#78716C]">{order.shippingAddress?.city}, {order.shippingAddress?.state}</div>
                    </td>

                    <td className="p-4 font-medium">
                      {order.items.reduce((sum, item) => sum + item.quantity, 0)} piece(s)
                    </td>

                    <td className="p-4 font-semibold text-[#1C1917]">
                      ₹{order.totalAmount.toLocaleString("en-IN")}
                    </td>

                    <td className="p-4">
                      <span className="capitalize px-2 py-0.5 text-[10px] font-semibold tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {order.paymentStatus} ({order.paymentMethod})
                      </span>
                    </td>

                    <td className="p-4">
                      <select
                        value={order.orderStatus}
                        onChange={(e) =>
                          handleQuickStatusUpdate(
                            order.id,
                            e.target.value as Order["orderStatus"]
                          )
                        }
                        className="text-[11px] py-1 px-2 border border-[#E7E5E4] bg-[#FAF8F5] text-[#1C1917] font-semibold uppercase tracking-wider focus:outline-none focus:border-[#6B1D2F]"
                      >
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="packed">Packed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      {order.trackingNumber && (
                        <div className="text-[10px] text-[#78716C] font-mono mt-1">
                          TRK: {order.trackingNumber}
                        </div>
                      )}
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => navigate({ to: `/admin/orders/${order.id}` as any })}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 bg-[#FAF8F5] border border-[#E7E5E4] text-[#1C1917] hover:bg-[#6B1D2F] hover:text-white transition-colors text-xs font-semibold uppercase tracking-wider"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
