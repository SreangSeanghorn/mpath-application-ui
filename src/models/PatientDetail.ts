import { Recommendation } from "./Recommendation";

export interface PatientDetail {
    id: string;
    name: string;
    address: string;
    phoneNumber: string;
    email: string;
    birthDate: string;
    recommendations: Recommendation[];
}