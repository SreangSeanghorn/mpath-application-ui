import { Component, inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PatientService } from '../../services/patient.service';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { Recommendation } from '../../models/Recommendation';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-recommendations',
  templateUrl: './recommendations.component.html',
  styleUrls: ['./recommendations.component.css'],
  imports: [
    MatTableModule,
    MatCheckboxModule,
    MatButtonModule,
    CommonModule
  ],
})
export class RecommendationsComponent implements OnInit {
  @Input()
  patientId: string | null = null;
  @Input() recommendations: Recommendation[] = [];

  
    private route: ActivatedRoute = inject(ActivatedRoute);
    private patientService: PatientService = inject(PatientService);


  ngOnInit(): void {
    console.log("Recommendations received:", this.recommendations);
  } 

  // Load recommendations for the patient
  loadRecommendations(patientId: string): void {
   
  }

  // Mark a recommendation as completed
  markAsCompleted(recommendation: any): void {
    if (!recommendation.isCompleted) {
      this.patientService.markRecommendationAsCompleted(recommendation.id)
        .subscribe({
          next: () => {
            recommendation.isCompleted = true; 
            console.log(`Recommendation ${recommendation.id} marked as completed.`);
          },
          error: (err) => console.error("Error updating recommendation:", err)
        });
    }
  }
}
