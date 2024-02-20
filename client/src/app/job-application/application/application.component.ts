import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApplicationService } from '../../application.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.css'],
  providers: [DatePipe],
})
export class ApplicationComponent implements OnInit {
  applications: any[];
  applicationForm: FormGroup;
  isEditMode: boolean = false;
  applicationId: string | '';
  showToast: boolean = false;
  constructor(
    private applicationService: ApplicationService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private router: Router
  ) {
    this.applications = [];
    this.applicationForm = this.fb.group({
      name: ['', Validators.required],
      dob: ['', Validators.required],
      city: [''],
      resume: [undefined, Validators.required],
      additionalDocuments: [undefined],
      phone: ['', Validators.required],
      description: [''],
    });
  }

  ngOnInit(): void {
    // this.applicationService.getApplications().subscribe(
    //   (applications) => {
    //     this.applications = applications;
    //   },
    //   (error) => {
    //     console.error('Error fetching applications:', error);
    //   }
    // );
    this.route.params.subscribe((params) => {
      this.applicationId = params['id'];
      this.isEditMode = !!this.applicationId;

      if (this.isEditMode) {
        this.applicationService
          .getApplicationById(this.applicationId)
          .subscribe(
            (application) => {
              const parsedDob = new Date(application.dob);
              const formattedDob = this.datePipe.transform(
                parsedDob,
                'yyyy-MM-dd'
              );
              this.applicationForm.patchValue({
                name: application.name,
                dob: formattedDob,
                city: application.city,
              });
            },
            (error: any) => {
              console.error('error..', error);
            }
          );
      }
    });
  }

  submitApplication(): void {
    if (this.applicationForm.valid) {
      const formData = new FormData();

      Object.keys(this.applicationForm.controls).forEach((key) => {
        const control = this.applicationForm.get(key);

        if (control instanceof File) {
          formData.append(key, control, control.name);
        } else {
          const value = control?.value;

          if (value instanceof Date) {
            const formattedDate = this.datePipe.transform(value, 'yyyy-MM-dd');
            if (formattedDate !== null) {
              formData.append(key, formattedDate);
            }
          } else {
            formData.append(key, value);
          }
        }
      });

      if (this.isEditMode) {
        this.applicationService
          .updateApplication(this.applicationId, formData)
          .subscribe(
            (response) => {
              this.showToast = true;
              setTimeout(() => {
                this.showToast = false;
                this.router.navigate(['/']);
              }, 2000);
            },
            (error: any) => {
              console.error('Error', error);
            }
          );
      } else {
        this.applicationService
          .submitApplication(formData)
          .subscribe((response) => {
            this.applications.push(response);
          });
      }
    } else {
      console.log('Not valid');
      Object.keys(this.applicationForm.controls).forEach((controlName) => {
        this.applicationForm.get(controlName)?.markAsTouched();
      });
    }
  }
}
