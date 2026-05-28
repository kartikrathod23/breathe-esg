import {useEffect,useState} from "react";
import UploadForm from "./components/UploadForm";
import RecordsTable from "./components/RecordsTable";
import MetricsCards from "./components/MetricsCards";
import FailedRows from "./components/FailedRows";
import api from "./lib/api";

import type {
    EmissionRecord,
    FailedRow
} from "./types/emission";

function App(){
    const [records,setRecords]=useState<EmissionRecord[]>([]);
    const [failedRows,setFailedRows]=useState<FailedRow[]>([]);
    const [filter,setFilter]=useState("all");

    const fetchRecords=async()=>{
        try{
            let url="/reviews/records/?organization_id=1";
            if(filter==="suspicious"){
                url+="&suspicious=true";
            }
            if(filter==="approved"){
                url+="&status=approved";
            }
            if(filter==="rejected"){
                url+="&status=rejected";
            }
            const response=await api.get(url);
            setRecords(response.data);
        }catch(error){
            console.log(error);
        }
    };

    const fetchFailedRows=async()=>{
        try{
            const response=await api.get("/reviews/failed-rows/");
            setFailedRows(response.data);
        }catch(error){
            console.log(error);
        }
    };

    const approveRecord=async(id:number)=>{
        try{
            await api.post( `/reviews/approve/${id}/`,{organization_id:1});
            fetchRecords();
        }catch(error){
            console.log(error);
            alert("Approval failed");
        }
    };

    const rejectRecord=async(id:number)=>{
        try{
            await api.post(`/reviews/reject/${id}/`,{organization_id:1});
            fetchRecords();
        }catch(error){
            console.log(error);
            alert("Reject failed");
        }
    };

    useEffect(()=>{
        fetchRecords();
        fetchFailedRows();
    },[filter]);

    return(
        <main className="min-h-screen bg-[#f5f7ff] px-4 md:px-6 xl:px-8 py-6">
            <div className="max-w-[2000px] mx-auto">
                <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6 mb-8">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-xl font-bold shadow-lg shrink-0">
                            E
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                                ESG Review Dashboard
                            </h1>

                            <p className="text-gray-600 mt-1">
                                Enterprise emissions ingestion and analyst review workflow
                            </p>

                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={()=>setFilter("all")}
                            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition ${
                                filter==="all"
                                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                                : "bg-white border border-gray-200 hover:bg-gray-50"
                            }`}
                        >
                            All
                        </button>

                        <button
                            onClick={()=>setFilter("suspicious")}
                            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition ${
                                filter==="suspicious"
                                ? "bg-red-600 text-white shadow-lg shadow-red-200"
                                : "bg-white border border-gray-200 hover:bg-gray-50"
                            }`}
                        >
                            Suspicious
                        </button>

                        <button
                            onClick={()=>setFilter("approved")}
                            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition ${
                                filter==="approved"
                                ? "bg-green-600 text-white shadow-lg shadow-green-200"
                                : "bg-white border border-gray-200 hover:bg-gray-50"
                            }`}
                        >
                            Approved
                        </button>

                        <button
                            onClick={()=>setFilter("rejected")}
                            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition ${
                                filter==="rejected"
                                ? "bg-gray-900 text-white shadow-lg"
                                : "bg-white border border-gray-200 hover:bg-gray-50"
                            }`}
                        >
                            Rejected
                        </button>

                    </div>

                </div>

                <div className="mb-6">
                    <MetricsCards records={records}/>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-[450px_1fr] gap-6">
                    <div className="space-y-6 xl:sticky xl:top-6 xl:self-start">
                        <UploadForm
                            onUploadSuccess={()=>{
                                fetchRecords();
                                fetchFailedRows();
                            }}
                        />
                        <FailedRows rows={failedRows}/>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="sticky top-0 z-20 bg-white border-b border-gray-200 px-6 py-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        Emission Records
                                    </h2>

                                    <p className="text-gray-500 text-sm mt-1">
                                        Normalized enterprise emissions data
                                    </p>
                                </div>

                                <div className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-xl text-sm font-semibold">
                                    {records.length} Records
                                </div>
                            </div>
                        </div>

                        <div className="max-h-[70vh] overflow-y-auto">
                            <RecordsTable
                                records={records}
                                onApprove={approveRecord}
                                onReject={rejectRecord}
                            />
                        </div>

                    </div>
                </div>
            </div>
        </main>

    );
}

export default App;