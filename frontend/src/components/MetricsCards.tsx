import type {EmissionRecord} from "../types/emission";

interface Props{records:EmissionRecord[];}

function MetricsCards({records}:Props){
    const suspicious=records.filter(r=>r.suspicious).length;
    const approved=records.filter(r=>r.status==="approved").length;
    const rejected=records.filter(r=>r.status==="rejected").length;

    return(
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-gray-200">
                <p className="text-sm text-gray-500">
                    Total Records
                </p>

                <h2 className="text-3xl font-bold mt-2">
                    {records.length}
                </h2>
            </div>

            <div className="bg-red-50 rounded-2xl p-5 border border-red-100">
                <p className="text-sm text-red-600">
                    Suspicious
                </p>

                <h2 className="text-3xl font-bold mt-2 text-red-700">
                    {suspicious}
                </h2>
            </div>

            <div className="bg-green-50 rounded-2xl p-5 border border-green-100">
                <p className="text-sm text-green-600">
                    Approved
                </p>

                <h2 className="text-3xl font-bold mt-2 text-green-700">
                    {approved}
                </h2>
            </div>

            <div className="bg-gray-100 rounded-2xl p-5 border border-gray-200">
                <p className="text-sm text-gray-600">
                    Rejected
                </p>

                <h2 className="text-3xl font-bold mt-2">
                    {rejected}
                </h2>
            </div>

        </div>
    );
}

export default MetricsCards;