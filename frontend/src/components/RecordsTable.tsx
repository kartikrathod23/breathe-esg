import type { EmissionRecord } from "../types/emission";

interface Props {
    records: EmissionRecord[];
    onApprove: (id: number) => void;
    onReject: (id: number) => void;
}

function RecordsTable({ records, onApprove, onReject }: Props) {
    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                        Emission Records
                    </h2>

                    <p className="text-gray-500 text-sm mt-1">
                        Normalized enterprise emissions data
                    </p>
                </div>

                <div className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-xl text-sm font-medium">
                    {records.length} Records
                </div>

            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-100">
                <table className="min-w-full table-auto">
                    <thead>
                        <tr className="border-b border-gray-200 text-left text-gray-600 font-semibold text-base">
                            <th className="pb-4 pl-2 pt-2">Type</th>
                            <th className="pb-4">Scope</th>
                            <th className="pb-4">Quantity</th>
                            <th className="pb-4">CO2e</th>
                            <th className="pb-4">Status</th>
                            <th className="pb-4">Review</th>
                            <th className="pb-4">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {records.map((record) => (
                            <tr
                                key={record.id}
                                className="border-b border-gray-100 hover:bg-gray-50 transition"
                            >
                                <td className="py-4 pr-4 pl-2 font-medium">
                                    {record.activity_type}
                                </td>
                                <td className="py-4 pr-4">
                                    {record.scope}
                                </td>
                                <td className="py-4 pr-4">
                                    {record.normalized_quantity.toFixed(2)} {record.normalized_unit}
                                </td>
                                <td className="py-4 pr-4">
                                    {record.co2e.toFixed(2)}
                                </td>

                                <td className="py-4 pr-4">
                                    {record.status === "approved" ? (
                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                                            Approved
                                        </span>
                                    ) : record.status === "rejected" ? (
                                        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                                            Rejected
                                        </span>
                                    ) : (
                                        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium">
                                            Review
                                        </span>
                                    )}
                                </td>

                                <td className="py-4 pr-4">
                                    {record.suspicious ? (
                                        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
                                            {record.suspicious_reason}
                                        </span>
                                    ) : (
                                        <span className="text-green-600 text-sm font-medium">
                                            Normal
                                        </span>
                                    )}

                                </td>

                                <td className="py-4 pr-4">
                                    {!record.is_locked && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => onApprove(record.id)}
                                                className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm cursor-pointer"
                                            >
                                                Approve
                                            </button>

                                            <button
                                                onClick={() => onReject(record.id)}
                                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm cursor-pointer"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>
        </div>
    );
}

export default RecordsTable;