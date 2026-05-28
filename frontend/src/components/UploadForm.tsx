import {useState} from "react";
import api from "../lib/api";

interface Props{
    onUploadSuccess:()=>void;
}

function UploadForm({onUploadSuccess}:Props){

    const [organizationId,setOrganizationId]=useState("1");
    const [sourceType,setSourceType]=useState("sap");
    const [file,setFile]=useState<File | null>(null);
    const [loading,setLoading]=useState(false);

    const handleSubmit=async(e:React.FormEvent)=>{
        e.preventDefault();
        if(!file){
            alert("Please select a CSV file");
            return;
        }
        try{
            setLoading(true);
            const formData=new FormData();
            formData.append("organization_id",organizationId);
            formData.append("source_type",sourceType);
            formData.append("file",file);

            await api.post("/upload/",formData,{
                headers:{
                    "Content-Type":"multipart/form-data"
                }
            });

            alert("Upload successful");
            onUploadSuccess();

        }catch(error){
            console.log(error);
            alert("Upload failed");
        }finally{
            setLoading(false);
        }
    };

    return(
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 md:p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                    Upload Data
                </h2>

                <p className="text-gray-500 text-sm mt-1">
                    Upload SAP, utility or travel CSV files
                </p>

            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Organization ID
                    </label>

                    <input
                        type="text"
                        value={organizationId}
                        onChange={(e)=>setOrganizationId(e.target.value)}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">
                        Source Type
                    </label>

                    <select
                        value={sourceType}
                        onChange={(e)=>setSourceType(e.target.value)}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-indigo-500"
                    >
                        <option value="sap">SAP Fuel Data</option>
                        <option value="utility">Utility Electricity</option>
                        <option value="travel">Corporate Travel</option>
                    </select>

                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">
                        CSV File
                    </label>

                    <input
                        type="file"
                        accept=".csv"
                        onChange={(e)=>{
                            if(e.target.files){
                                setFile(e.target.files[0]);
                            }
                        }}
                        className="w-full border border-dashed border-gray-300 rounded-xl px-4 py-6 bg-gray-50"
                    />

                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:opacity-95 transition text-white py-3 rounded-xl font-medium cursor-pointer shadow-sm"
                >
                    {loading ? "Uploading..." : "Upload CSV"}
                </button>
            </form>
        </div>
    );
}

export default UploadForm;