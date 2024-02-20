import { Component, OnInit } from '@angular/core';
import { ApplicationService } from '../application.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-applications',
  templateUrl: './list-applications.component.html',
  styleUrls: ['./list-applications.component.css'],
  providers: [DatePipe],
})
export class ListApplicationsComponent implements OnInit {
  applications: any[] = [];
  searchTerm: string = '';
  selectedApplication: any;

  constructor(
    private applicationService: ApplicationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadApplications();
  }
  editApplication(application: any): void {
    this.router.navigate(['/application', application.unqId]);
  }
  loadApplications(): void {
    this.applicationService.getApplications().subscribe(
      (applications) => {
        this.applications = applications;
      },
      (error) => {
        console.error('Errror..', error);
      }
    );
  }
  createNewApplication() {
    this.router.navigate(['/application']);
  }
  searchApplications(): void {
    if (this.searchTerm.trim() !== '') {
      this.applications = this.applications.filter((app) =>
        app.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.loadApplications();
    }
  }
}
