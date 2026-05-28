export interface EmissionRecord{
    id:number;
    scope:string;
    category:string;
    activity_type:string;
    quantity:number;
    unit:string;
    normalized_quantity:number;
    normalized_unit:string;
    co2e:number;
    suspicious:boolean;
    suspicious_reason:string;
    status:string;
    is_locked:boolean;
    approved_at:string | null;
    created_at:string;
}

export interface FailedRow{
    id:number;
    raw_data:Record<string,string>;
    error_message:string;
    created_at:string;
}