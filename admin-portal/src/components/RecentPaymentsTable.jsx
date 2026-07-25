function RecentPaymentsTable({ payments = [] }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-[#e5edf6] bg-white shadow-[0_14px_40px_rgba(15,41,64,0.08)] p-6 mt-8">
      <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-[#2678ea] via-[#5fb6ff] to-[#2678ea]"></div>

      <h2 className="text-[20px] font-bold mb-6 text-[#12324d]">
        Recent Payments
      </h2>

      <div className="overflow-hidden rounded-lg border border-[#e5edf6]">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-[#2678ea]/8 to-[#5fb6ff]/8">
              <th className="p-3 text-left text-[12px] font-bold tracking-wider text-[#1a5cc2] uppercase">
                Reference
              </th>
              <th className="p-3 text-left text-[12px] font-bold tracking-wider text-[#1a5cc2] uppercase">
                District
              </th>
              <th className="p-3 text-right text-[12px] font-bold tracking-wider text-[#1a5cc2] uppercase">
                Amount
              </th>
              <th className="p-3 text-left text-[12px] font-bold tracking-wider text-[#1a5cc2] uppercase">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {payments.length === 0 ? (
              <tr>
                <td className="p-4 text-center text-[#5c7188]" colSpan="4">
                  No recent payments found.
                </td>
              </tr>
            ) : (
              payments.map((payment, index) => (
                <tr
                  key={payment.referenceNumber || index}
                  className={`border-t border-[#e5edf6] ${
                    index % 2 === 1 ? "bg-[#f8fbff]/70" : ""
                  } transition-all duration-150 hover:bg-[#f0f7ff] hover:shadow-[inset_3px_0_0_#2678ea]`}
                >
                  <td className="p-3 text-[13.5px] tabular-nums text-[#5c7188]">
                    {payment.referenceNumber}
                  </td>
                  <td className="p-3 text-[13.5px] text-[#12324d] font-medium">
                    {payment.district}
                  </td>
                  <td className="p-3 text-[13.5px] text-right tabular-nums font-bold text-[#1a5cc2]">
                    Rs. {Number(payment.amount || 0).toLocaleString("en-LK")}
                  </td>
                  <td className="p-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold ${
                        payment.status === "PAID"
                          ? "bg-[#34c759]/12 text-[#1ea346]"
                          : "bg-[#f59e0b]/12 text-[#b45309]"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          payment.status === "PAID" ? "bg-[#1ea346]" : "bg-[#b45309]"
                        }`}
                      ></span>
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