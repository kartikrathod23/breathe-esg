import type {FailedRow} from "../types/emission";

interface Props{
    rows:FailedRow[];
}

function FailedRows({rows}:Props){
    return(
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-2xl font-bold mb-4">
                Failed Rows
            </h2>

            {rows.length===0 ? (
                <p className="text-gray-500">
                    No failed ingestion rows
                </p>
            ):(
                <div className="space-y-3">
                    {rows.map((row)=>(
                        <div
                            key={row.id}
                            className="border border-red-100 bg-red-50 rounded-xl p-4"
                        >
                            <p className="text-sm text-red-700 font-medium">
                                {row.error_message}
                            </p>

                            <pre className="text-xs mt-2 overflow-x-auto">
                                {JSON.stringify(row.raw_data,null,2)}
                            </pre>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default FailedRows;