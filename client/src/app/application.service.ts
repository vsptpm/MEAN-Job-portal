import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  private apiUrl = 'http://localhost:3000/api/applications';

  constructor(private http: HttpClient) {}

  getApplications(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
  getApplicationById(id: string): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<any>(url);
  }
  submitApplication(formData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, formData);
  }
  updateApplication(
    applicationId: string,
    formData: FormData
  ): Observable<any> {
    return this.http.put(`${this.apiUrl}/${applicationId}`, formData);
  }
}
