import { Injectable } from '@angular/core';
import { Patient } from '../models/Patient';
import { Recommendation } from '../models/Recommendation';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { PaginationForPatientsList } from '../models/PaginationForPatientsList';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BaseAPIResponse } from '../models/BaseAPIResponse';
import { PatientDetail } from '../models/PatientDetail';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private API_URL = 'http://localhost:5063/api/patients';
  public listOfPatients: BehaviorSubject<Patient[]> = new BehaviorSubject<Patient[]>([]);
  public dataObserved: Observable<Patient[]> = this.listOfPatients.asObservable();

  public paginationOfPatients: BehaviorSubject<PaginationForPatientsList | null> = new BehaviorSubject<PaginationForPatientsList| null>(null);
  public paginationObserved: Observable<PaginationForPatientsList | null> = this.paginationOfPatients.asObservable();

  constructor(private http: HttpClient) {

    
  }

  getPatients(size = 10, page = 0, filter = "", sortBy = "Date", sortOrder = "DESC") {
    let params = new HttpParams()
      .set('size', size)
      .set('page', page)
      .set('sortBy', sortBy)
      .set('sortOrder', sortOrder);

    if (filter) {
      params = params.set('filter', filter);
    }

    this.http.get<{ totalPage: number; page: number; pageSize: number; data: PaginationForPatientsList }>(`${this.API_URL}/get-list`)
      .subscribe({
        next: (response) => {
          if (response && response.data) {
            this.listOfPatients.next(response.data.data);
            this.paginationOfPatients.next({
              totalPages: response.totalPage,
              page: response.page,
              pageSize: response.pageSize,
              data: response.data.data
            });
            console.log("Patients loaded successfully:", response.data);
            console.log("Pagination data:", response.totalPage, response.pageSize, response.page);
          } else {
            console.error("Invalid API response:", response);
          }
        },
        error: (error) => {
          console.error("Error fetching patients:", error);
          alert("Failed to load patients. Please check your API.");
        }
      });
  }

  private recommendations: { [key: string]: Recommendation[] } = {
    1: [
      new Recommendation(1, 'Recommendation 1', 'This is a recommendation'),
      new Recommendation(
        2,
        'Recommendation 2',
        'This is another recommendation'
      ),
    ],
  };


  getPatientById(id: string): Observable < PatientDetail > {
      return this.http.get<BaseAPIResponse<PatientDetail>>(`${this.API_URL}/${id}`).pipe(
          map((response: BaseAPIResponse<PatientDetail>) => {
              if (response.isSuccess) {
                  return response.data;
              } else {
                  throw new Error(response.message);
              }
          })
      );
    
  }

  getRecommendations(patientId: string) {
    return this.recommendations[patientId] || [];
  }

  markRecommendationAsCompleted(recommendationId: string): Observable<void> {
    var url = 'http://localhost:5063/api/recommendations/mark-recommendation-as-completed'
    var userId = 'eaf74254-5df5-458f-e495-08dd3c244bfe'

    return this.http.put<void>(`${url}?recommendationId=${recommendationId}&userId=${userId}`, {});
  }
  getRecommendationsByPatientId(patientId: string): Observable<PatientDetail> {
    return this.http.get<PatientDetail>(`${this.API_URL}/${patientId}/recommendations`);
    
  }
}
