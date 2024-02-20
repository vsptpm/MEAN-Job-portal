import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationComponent } from './job-application/application/application.component';
import { ListApplicationsComponent } from './list-applications/list-applications.component';

const routes: Routes = [
  { path: '', component: ListApplicationsComponent },
  { path: 'application', component: ApplicationComponent },
  { path: 'application/:id', component: ApplicationComponent },

  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
