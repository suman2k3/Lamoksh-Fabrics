import React, { useState, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { dbStore, Order } from "@/lib/db/store";
import {
  ArrowLeft,
  Printer,
  Truck,
  CheckCircle,
  Clock,
  Package,
  MapPin,
  User,
  CreditCard,
  FileText,
  Save,
} from "lucide-react";

export const Route = createFileRoute("/admin/orders/$id")({
  component: AdminOrderDetailPage,
});

function AdminOrderDetailPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [courierName, setCourierName] = useState("");
  const [status, setStatus] = useState<Order["orderStatus"]>("confirmed");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadOrder = () => {
    const found = dbStore.getOrderById(id);
    if (found) {
      setOrder(found);
      setStatus(found.orderStatus);
      setTrackingNumber(found.trackingNumber || "");
      setCourierName(found.courierName || "BlueDart Express");
    }
  };

  useEffect(() => {
    loadOrder();
  }, [id]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleUpdateFulfillment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!order) return;

    dbStore.updateOrderStatus(order.id, status, trackingNumber, courierName);
    loadOrder();
    showToast("Order fulfillment and shipment details updated!");
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  if (!order) {
    return (
      <div className="p-12 text-center bg-white border border-[#E7E5E4]">
        <h2 className="text-xl font-serif text-[#1C1917]">Order Not Found</h2>
        <p className="text-xs text-[#78716C] mt-2">No order matching ID "{id}".</p>
        <button
          onClick={() => navigate({ to: "/admin/orders" as any })}
          className="mt-4 px-4 py-2 bg-[#6B1D2F] text-white text-xs uppercase font-semibold"
        >
          Return to Orders List
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto print:p-0 print:max-w-none">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#1C1917] text-white px-5 py-3 shadow-xl border-l-4 border-[#6B1D2F] flex items-center space-x-3 text-sm print:hidden">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 border border-[#E7E5E4] shadow-sm print:hidden">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate({ to: "/admin/orders" as any })}
            className="p-2 border border-[#E7E5E4] bg-white hover:bg-[#FAF8F5] text-[#1C1917] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl font-serif font-light text-[#1C1917] flex items-center space-x-3">
              <span>Order: {order.orderNumber}</span>
              <span className="text-xs uppercase px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 font-sans font-semibold">
                {order.orderStatus}
              </span>
            </h1>
            <p className="text-xs text-[#78716C] mt-0.5 font-sans">
              Placed on {new Date(order.createdAt).toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        <button
          onClick={handlePrintInvoice}
          className="flex items-center space-x-2 px-5 py-2 border border-[#E7E5E4] text-[#1C1917] bg-white hover:bg-[#FAF8F5] text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
        >
          <Printer className="w-4 h-4 text-[#6B1D2F]" />
          <span>Print Tax Invoice</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Itemized Products & Financial Summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white border border-[#E7E5E4] p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-serif text-[#1C1917] pb-3 border-b border-[#E7E5E4] flex items-center space-x-2">
              <Package className="w-5 h-5 text-[#6B1D2F]" />
              <span>Purchased Fashion & Jewellery Pieces</span>
            </h2>

            <div className="divide-y divide-[#E7E5E4]">
              {order.items.map((item) => (
                <div key={item.id} className="py-4 flex items-center justify-between gap-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.productImage || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=200"}
                      alt={item.productTitle}
                      className="w-14 h-18 object-cover border border-[#E7E5E4] bg-[#FAF8F5]"
                    />
                    <div>
                      <h3 className="font-serif font-medium text-[#1C1917]">
                        {item.productTitle}
                      </h3>
                      <div className="text-xs text-[#78716C] mt-0.5 space-x-3">
                        {item.size && <span>Size: <strong className="text-[#1C1917]">{item.size}</strong></span>}
                        <span>SKU: {item.productHandle}</span>
                      </div>
                      <div className="text-xs text-[#57534E] mt-1">
                        ₹{item.price.toLocaleString("en-IN")} × {item.quantity} unit(s)
                      </div>
                    </div>
                  </div>

                  <div className="text-right font-semibold text-[#1C1917]">
                    ₹{item.totalPrice.toLocaleString("en-IN")}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Breakdown */}
          <div className="bg-white border border-[#E7E5E4] p-6 shadow-sm space-y-3 text-xs">
            <h2 className="text-lg font-serif text-[#1C1917] pb-3 border-b border-[#E7E5E4] flex items-center space-x-2">
              <FileText className="w-5 h-5 text-[#6B1D2F]" />
              <span>Payment & Tax Summary</span>
            </h2>

            <div className="flex justify-between py-1 text-[#57534E]">
              <span>Subtotal</span>
              <span>₹{order.subtotal.toLocaleString("en-IN")}</span>
            </div>

            {order.discountAmount > 0 && (
              <div className="flex justify-between py-1 text-emerald-700 font-medium">
                <span>Discount ({order.couponCode || "Applied Coupon"})</span>
                <span>- ₹{order.discountAmount.toLocaleString("en-IN")}</span>
              </div>
            )}

            <div className="flex justify-between py-1 text-[#57534E]">
              <span>Complimentary Express Shipping</span>
              <span>{order.shippingFee === 0 ? "FREE" : `₹${order.shippingFee}`}</span>
            </div>

            <div className="flex justify-between py-1 text-[#57534E]">
              <span>GST Tax (Included)</span>
              <span>₹{order.taxAmount.toLocaleString("en-IN")}</span>
            </div>

            <div className="pt-3 border-t border-[#E7E5E4] flex justify-between items-center text-sm font-bold text-[#1C1917]">
              <span>Total Amount Paid</span>
              <span className="text-lg font-serif text-[#6B1D2F]">
                ₹{order.totalAmount.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Customer Info & Fulfillment Control */}
        <div className="space-y-6">
          {/* Customer & Delivery Details */}
          <div className="bg-white border border-[#E7E5E4] p-6 shadow-sm space-y-4">
            <h2 className="text-lg font-serif text-[#1C1917] pb-3 border-b border-[#E7E5E4] flex items-center space-x-2">
              <User className="w-5 h-5 text-[#6B1D2F]" />
              <span>Client Information</span>
            </h2>

            <div className="text-xs space-y-2 text-[#57534E]">
              <div className="font-semibold text-[#1C1917] text-sm">
                {order.customerName}
              </div>
              <div>Email: {order.customerEmail}</div>
              <div>Phone: {order.customerPhone}</div>

              <div className="pt-3 border-t border-[#E7E5E4]">
                <div className="font-semibold text-[#1C1917] uppercase tracking-wider mb-1 flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-[#6B1D2F]" />
                  <span>Shipping Address</span>
                </div>
                <div>{order.shippingAddress.street}</div>
                <div>
                  {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                </div>
                <div>{order.shippingAddress.country}</div>
              </div>
            </div>
          </div>

          {/* Fulfillment Pipeline Control Form */}
          <div className="bg-white border border-[#E7E5E4] p-6 shadow-sm space-y-4 print:hidden">
            <h2 className="text-lg font-serif text-[#1C1917] pb-3 border-b border-[#E7E5E4] flex items-center space-x-2">
              <Truck className="w-5 h-5 text-[#6B1D2F]" />
              <span>Shipment & Dispatch</span>
            </h2>

            <form onSubmit={handleUpdateFulfillment} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="block font-semibold uppercase tracking-wider text-[#1C1917]">
                  Fulfillment Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Order["orderStatus"])}
                  className="w-full px-3 py-2 border border-[#E7E5E4] bg-[#FAF8F5] focus:outline-none focus:border-[#6B1D2F]"
                >
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing / Tailoring</option>
                  <option value="packed">Packed for Courier</option>
                  <option value="shipped">Shipped in Transit</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block font-semibold uppercase tracking-wider text-[#1C1917]">
                  Courier Partner Name
                </label>
                <input
                  type="text"
                  value={courierName}
                  onChange={(e) => setCourierName(e.target.value)}
                  placeholder="BlueDart / Delhivery / DHL"
                  className="w-full px-3 py-2 border border-[#E7E5E4] bg-[#FAF8F5] focus:outline-none focus:border-[#6B1D2F]"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-semibold uppercase tracking-wider text-[#1C1917]">
                  Airway Bill / Tracking Number
                </label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="e.g. BLUEDART-77192"
                  className="w-full px-3 py-2 border border-[#E7E5E4] bg-[#FAF8F5] focus:outline-none focus:border-[#6B1D2F]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#6B1D2F] text-white uppercase tracking-wider font-semibold text-xs hover:bg-[#521624] transition-colors flex items-center justify-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>Update Order Status</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
