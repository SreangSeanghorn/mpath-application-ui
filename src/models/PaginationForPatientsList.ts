import { Patient } from "./Patient";

export class PaginationForPatientsList {
    constructor(
        public totalPages: number,
        public page: number,
        public pageSize: number,
        public data: Patient[]
    ) {}
}