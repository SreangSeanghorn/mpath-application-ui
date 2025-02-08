import { Component, inject, OnInit } from '@angular/core';
import { PatientService } from '../../services/patient.service';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { Patient } from '../../models/Patient';
import { Router } from '@angular/router';
import { RecommendationsComponent } from "../recommendations/recommendations.component";
import { BrowserModule } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css'],
  imports: [
    MatPaginatorModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    FormsModule,
    RecommendationsComponent,
    HttpClientModule,
    CommonModule
],
})
export class PatientListComponent implements OnInit {
  patients: Patient[] = [];
  filteredPatients: Patient[] = [];
  searchQuery: string = '';
  displayedColumns: string[] = [
    'id',
    'name',
    'address',
    'phone',
    'dob',
    'actions',
  ];
  pageSize: number = 10;
  page = 0;
  currentPage: number = 0;
  private router : Router = inject(Router);
  private patientService: PatientService = inject(PatientService);

  ngOnInit() {
    this.patientService.getPatients();
    this.patientService.dataObserved.subscribe((patients) => {
      if (patients && Array.isArray(patients)) {
        this.patients = patients;
        this.applyFilters();
      } else {
        console.error("Error: Patients data is not an array", patients);
      }
    });
  }

  loadPatients(page:number = 0, size:number = 10) {
    this.patientService.getPatients(size, page, this.searchQuery);
  }

  applyFilters() {
    const query = this.searchQuery.toLowerCase();
    this.filteredPatients = this.patients
      .filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.id.toString().includes(query)
      )
      .slice(
        this.currentPage * this.pageSize,
        (this.currentPage + 1) * this.pageSize
      );
  }

  onPageChange(event: any) {
    this.currentPage = event.pageIndex;
    this.applyFilters();
  }

  viewPatient(id: number) {
    this.router.navigate(['/patients', id]);
  }
}
