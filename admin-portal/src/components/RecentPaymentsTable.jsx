function RecentPaymentsTable({ payments = [] }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-[#22314A] bg-[#101C30] shadow-[0_14px_40px_rgba(0,0,0,0.35)] p-6 mt-8">
      <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#8A6A17] via-[#C9A227] to-[#8A6A17]"></div>

      <h2 className="font-serif text-[20px] mb-6 text-[#F4F6F9]">
        Recent Payments
      </h2>

      <div className="overflow-hidden rounded-lg border border-[#22314A]">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#0D1728]">
              <th className="p-3 text-left text-[12px] font-semibold tracking-wide text-[#C9A227] uppercase">
                Reference
              </th>
              <th className="p-3 text-left text-[12px] font-semibold tracking-wide text-[#C9A227] uppercase">
                District
              </th>
              <th className="p-3 text-right text-[12px] font-semibold tracking-wide text-[#C9A227] uppercase">
                Amount
              </th>
              <th className="p-3 text-left text-[12px] font-semibold tracking-wide text-[#C9A227] uppercase">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {payments.length === 0 ? (
              <tr>
                <td className="p-4 text-center text-[#9FB0C3]" colSpan="4">
                  No recent payments found.
                </td>
              </tr>
            ) : (
              payments.map((payment, index) => (
                <tr
                  key={payment.referenceNumber || index}
                  className={`border-t border-[#22314A] ${
                    index % 2 === 1 ? "bg-[#0D1728]/50" : ""
                  } hover:bg-[#17253C] transition-colors`}
                >
                  <td className="p-3 text-[13.5px] tabular-nums text-[#C3CEDB]">
                    {payment.referenceNumber}
                  </td>
                  <td className="p-3 text-[13.5px] text-[#F4F6F9] font-medium">
                    {payment.district}
                  </td>
                  <td className="p-3 text-[13.5px] text-right tabular-nums font-semibold text-[#E3CE84]">
                    Rs. {Number(payment.amount || 0).toLocaleString("en-LK")}
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-[12px] font-semibold ${
                        payment.status === "PAID"
                          ? "bg-[#3FA772]/15 text-[#8FD9AF]"
                          : "bg-[#B4543A]/15 text-[#E3A392]"
                      }`}
                    >
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RecentPaymentsTable;
