import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Patient } from '../../models/Patient';
import { PatientService } from '../../services/patient.service';
import { RecommendationsComponent } from "../recommendations/recommendations.component";
import { PatientDetail } from '../../models/PatientDetail';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-patient-detail',
  templateUrl: './patient-detail.component.html',
  styleUrl: './patient-detail.component.scss',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    RecommendationsComponent,
    CommonModule
],
})
export class PatientDetailComponent implements OnInit {
  patientService: PatientService = inject(PatientService);
  route: ActivatedRoute = inject(ActivatedRoute);
  patientId!: string;

  patient!: PatientDetail;
  patients: Patient[] = [];
  // get id from route params and get patient from service
  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.patientId = params['id'];
    });
    if (this.patientId) {
      this.patientService.getPatientById(this.patientId).subscribe({
        next: (data) => {
          this.patient = data;
          console.log("Patient details loaded:", this.patient);
        },
        error: (err) => {
          console.error("Error fetching patient:", err);
        }
      });
    }

  }

  goBack() {
    window.history.back();
  }
}
