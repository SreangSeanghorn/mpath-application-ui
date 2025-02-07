export interface BaseAPIResponse<T> {
    isSuccess: boolean;
    status: number;
    message: string;
    data: T;
}