import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './shared/layout/layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RequestComponent } from './components/request/request.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: '',
    component: LayoutComponent, // LayoutComponent wraps all pages
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'request', component: RequestComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
