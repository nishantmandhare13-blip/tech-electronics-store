import React, { useRef } from 'react';
import { FileCheck, Printer, X, ShieldCheck, Mail, Phone, MapPin, Landmark } from 'lucide-react';
import { Order } from '../types';
import { sound } from '../audio';

interface InvoiceModalProps {
  order: Order;
  onClose: () => void;
  customerProfile?: { name: string; email: string; phone: string; address: string };
}

export default function InvoiceModal({ order, onClose, customerProfile }: InvoiceModalProps) {
  const printAreaRef = useRef<HTMLDivElement | null>(null);

  // Indian Rupee formatting helper
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const handlePrint = () => {
    sound.playClick();
    
    // Create an elegant print-only window to prevent UI panels from cluttering print outputs
    const printContents = printAreaRef.current?.innerHTML;
    const originalContents = document.body.innerHTML;

    if (!printContents) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      // Fallback: simple window print if popup blocked
      window.print();
      return;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${order.orderNumber}</title>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
          <style>
            body {
              font-family: 'Inter', sans-serif;
              color: #1e293b;
              padding: 40px;
              line-height: 1.5;
            }
            .invoice-box {
              max-width: 800px;
              margin: auto;
            }
            .header-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 30px;
            }
            .text-right { text-align: right; }
            .font-mono { font-family: 'JetBrains Mono', monospace; }
            h1 { font-size: 28px; margin: 0; font-weight: 800; color: #2563eb; text-transform: uppercase; letter-spacing: -0.5px; }
            .badge { background: #dcfce7; color: #15803d; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: bold; }
            .grid-details {
              display: grid;
              grid-template-cols: 1fr 1fr;
              gap: 20px;
              border-top: 1px solid #e2e8f0;
              border-bottom: 1px solid #e2e8f0;
              padding: 20px 0;
              margin-bottom: 30px;
            }
            .details-title { font-size: 11px; text-transform: uppercase; color: #94a3b8; font-weight: 700; margin-bottom: 6px; letter-spacing: 0.5px; }
            .details-content { font-size: 13px; color: #334155; font-weight: 500; }
            .items-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 30px;
            }
            .items-table th {
              background: #f1f5f9;
              text-align: left;
              padding: 10px 12px;
              font-size: 11px;
              text-transform: uppercase;
              color: #475569;
              font-weight: 700;
              border-bottom: 2px solid #cbd5e1;
            }
            .items-table td {
              padding: 12px;
              font-size: 13px;
              border-bottom: 1px solid #f1f5f9;
              color: #334155;
            }
            .summary-table {
              width: 40%;
              margin-left: auto;
              border-collapse: collapse;
            }
            .summary-table td {
              padding: 8px 12px;
              font-size: 13px;
              color: #475569;
            }
            .summary-table .total-row td {
              font-size: 16px;
              font-weight: 800;
              color: #0f172a;
              border-top: 2px solid #e2e8f0;
              padding-top: 12px;
            }
            .footer-info {
              margin-top: 50px;
              border-top: 1px solid #e2e8f0;
              padding-top: 20px;
              font-size: 11px;
              color: #94a3b8;
              text-align: center;
            }
            @media print {
              body { padding: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="invoice-box">
            ${printContents}
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/75 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-3xl rounded-2xl bg-white dark:bg-slate-900 shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 my-8">
        
        {/* Modal Banner Controls */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-850 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <FileCheck className="w-5.5 h-5.5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-slate-800 dark:text-white">
                Tax Invoice Generated
              </h3>
              <p className="text-[10px] text-slate-400 font-mono">
                Order Reference: {order.orderNumber}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-sans font-bold text-xs transition-all shadow cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE AREA CONTAINER */}
        <div className="p-6 overflow-y-auto max-h-[70vh] custom-scrollbar bg-white" ref={printAreaRef}>
          <div className="text-slate-800">
            {/* Header section */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="badge">PAID IN FULL</span>
                <h1 className="font-display font-black text-2xl text-blue-600 tracking-tight mt-2 uppercase">
                  Tech Electronics Store
                </h1>
                <p className="text-xs text-slate-500 font-medium max-w-xs mt-1 leading-normal">
                  Corporate HQ: Sector 44, Gurgaon, Haryana - 122003<br />
                  Fulfillment: Outer Ring Road, Bellandur, Bengaluru - 560103
                </p>
                <div className="mt-2.5 text-[9px] font-mono text-slate-400">
                  <span>GSTIN: 07AAAATC1109G1Z2 &bull; CIN: U74999HR2026PTC100412</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Tax Invoice
                </span>
                <span className="text-lg font-mono font-bold text-slate-800 block mt-0.5">
                  {order.orderNumber}
                </span>
                <div className="mt-4 text-xs space-y-0.5 text-slate-500 font-medium">
                  <div>Date: <span className="text-slate-800 font-mono">{new Date(order.timestamp).toLocaleString('en-IN')}</span></div>
                  <div>Payment Mode: <span className="text-slate-800 font-semibold">NetBanking / Card</span></div>
                  <div>Delivery Hub: <span className="text-indigo-600 font-semibold">Bengaluru Node</span></div>
                </div>
              </div>
            </div>

            {/* Grid Client Details */}
            <div className="grid grid-cols-2 gap-6 border-y border-slate-200 py-4 mb-6">
              <div>
                <span className="details-title block">Billed To (Customer Details)</span>
                <div className="details-content space-y-1 mt-1">
                  <div className="font-bold text-slate-800 text-sm">{order.customerName}</div>
                  <div className="flex items-center space-x-1.5 text-xs text-slate-500">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{order.customerEmail}</span>
                  </div>
                  <div className="flex items-center space-x-1.5 text-xs text-slate-500">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{order.customerPhone}</span>
                  </div>
                </div>
              </div>

              <div>
                <span className="details-title block">Shipping Address (Logistics)</span>
                <div className="details-content space-y-1 mt-1">
                  <div className="flex items-start space-x-1.5 text-xs text-slate-600">
                    <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <span className="leading-normal font-medium">{customerProfile?.address || 'Online Order Address, India'}</span>
                  </div>
                  <div className="mt-2 text-[10px] font-sans font-bold text-indigo-600 flex items-center space-x-1">
                    <Landmark className="w-3.5 h-3.5 shrink-0" />
                    <span>Estimated Doorstep Delivery: {new Date(order.estimatedDelivery).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Items Table */}
            <table className="items-table">
              <thead>
                <tr>
                  <th style={{ width: '45%' }}>Product Description</th>
                  <th style={{ width: '15%' }} className="text-right">Unit Price</th>
                  <th style={{ width: '15%' }} className="text-right">Quantity</th>
                  <th style={{ width: '10%' }} className="text-right">GST (18%)</th>
                  <th style={{ width: '15%' }} className="text-right">Net Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, idx) => {
                  const basePrice = item.price / 1.18;
                  const rowGst = item.gstAmount;

                  return (
                    <tr key={idx}>
                      <td>
                        <div className="font-bold text-slate-800">{item.name}</div>
                        <span className="text-[10px] text-slate-400 font-mono">ID: {item.productId}</span>
                      </td>
                      <td className="text-right font-mono">{formatCurrency(item.price)}</td>
                      <td className="text-right font-mono font-bold">{item.quantity}</td>
                      <td className="text-right font-mono text-slate-400">{formatCurrency(rowGst)}</td>
                      <td className="text-right font-mono font-bold text-slate-800">{formatCurrency(item.total)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Pricing Summary calculations */}
            <div className="flex justify-between items-start mt-4">
              <div className="max-w-sm p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center space-x-1.5 text-slate-600">
                  <ShieldCheck className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Government of India Tax Compliant</span>
                </div>
                <p className="text-[9px] text-slate-400 mt-1 leading-normal">
                  All tax computations are dynamically calculated and processed under Indian IGST rules. Original signature and stamp are pre-approved under modern digital audit regulations. Retain for tax credits.
                </p>
              </div>

              <table className="summary-table">
                <tbody>
                  <tr>
                    <td>Gross Subtotal</td>
                    <td className="text-right font-mono">{formatCurrency(order.subtotal)}</td>
                  </tr>
                  {order.discountAmount > 0 && (
                    <tr>
                      <td className="text-emerald-600 font-bold">Bulk Discount Applied</td>
                      <td className="text-right font-mono text-emerald-600 font-bold">-{formatCurrency(order.discountAmount)}</td>
                    </tr>
                  )}
                  <tr>
                    <td>CGST + SGST Share (18%)</td>
                    <td className="text-right font-mono text-slate-400">{formatCurrency(order.gstTotal)}</td>
                  </tr>
                  <tr className="total-row">
                    <td>Final Payable</td>
                    <td className="text-right font-mono text-blue-600">{formatCurrency(order.finalAmount)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Signature & footer terms */}
            <div className="flex justify-between items-end mt-12 pt-8 border-t border-slate-200/60">
              <div className="text-[10px] text-slate-400">
                <span className="font-bold uppercase tracking-wider block mb-1 text-slate-500">Terms & Conditions:</span>
                <span>1. Goods once sold are backed by 1-year priority store warranty.</span><br />
                <span>2. Disputes if any are subject to Bangalore jurisdiction only.</span><br />
                <span>3. Returns accepted in original seals up to 7 days from dispatch.</span>
              </div>

              <div className="text-center w-40">
                <div className="font-mono text-xs italic text-slate-400 h-10 flex items-center justify-center">
                  Digitally Verified
                </div>
                <div className="border-t border-slate-200 pt-2 font-display text-[9px] uppercase tracking-wider font-bold text-slate-500">
                  Authorized Signatory
                </div>
              </div>
            </div>

            <div className="footer-info">
              <span>Thank you for shopping at Tech Electronics Store! Your patronage supports our PM college research.</span>
            </div>
          </div>
        </div>

        {/* Modal footer controls */}
        <div className="px-6 py-4.5 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-850 flex items-center justify-between">
          <p className="text-[10px] text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>Digital invoice copy securely backed up to Tech Electronics SQL Ledger.</span>
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-sans font-bold text-xs hover:bg-slate-300 dark:hover:bg-slate-700 transition-all cursor-pointer"
          >
            Close & Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
