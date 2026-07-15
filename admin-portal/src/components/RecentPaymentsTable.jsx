function RecentPaymentsTable() {

  const payments = [
    {
      ref: "TR1001",
      district: "Colombo",
      amount: 5000,
      status: "Paid",
    },
    {
      ref: "TR1002",
      district: "Galle",
      amount: 3000,
      status: "Pending",
    },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/12 bg-white/8 backdrop-blur-md shadow-[0_14px_40px_rgba(0,0,0,0.32)] p-6 mt-8">
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-blue-200/80 via-blue-300/80 to-blue-200/80"></div>

      <h2 className="text-2xl font-semibold mb-6 text-white">
        Recent Payments
      </h2>

      <table className="w-full">

        <thead className="bg-white/10 text-slate-200">
          <tr>
            <th className="p-3 text-left">Reference</th>
            <th className="p-3 text-left">District</th>
            <th className="p-3 text-left">Amount</th>
            <th className="p-3 text-left">Status</th>
          </tr>
        </thead>

        <tbody className="text-slate-200">

          {payments.map((payment, index) => (

            <tr key={index} className="border-b border-white/10 hover:bg-white/6 transition-colors">

              <td className="p-3">{payment.ref}</td>

              <td className="p-3">{payment.district}</td>

              <td className="p-3">
                Rs. {payment.amount}
              </td>

              <td className="p-3">

                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    payment.status === "Paid"
                      ? "bg-blue-300/25 text-blue-100"
                      : "bg-blue-200/20 text-blue-100"
                  }`}
                >
                  {payment.status}
                </span>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default RecentPaymentsTable;