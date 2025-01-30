  import { NgModule } from '@angular/core';
  import { BrowserModule } from '@angular/platform-browser';
  import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
  import { MatButtonModule } from '@angular/material/button';
  import { MatInputModule } from '@angular/material/input';
  import { MatCardModule } from '@angular/material/card';
  import { MatGridListModule } from '@angular/material/grid-list';
  import { MatSidenavModule } from '@angular/material/sidenav';
  import { MatIconModule } from '@angular/material/icon';
  import { MatToolbarModule } from '@angular/material/toolbar';
  import { MatTableModule } from '@angular/material/table';
  import { MatDialogModule } from '@angular/material/dialog';
  import { MatPaginatorModule } from '@angular/material/paginator';
  import { MatFormFieldModule } from '@angular/material/form-field'; // Import MatFormFieldModule
  import { HttpClientModule } from '@angular/common/http';
  import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Ensure FormsModule and ReactiveFormsModule are imported
  import { AppRoutingModule } from './app-routing.module';
  import { AppComponent } from './app.component';
  import { LoginComponent } from './components/login/login.component';
  import { LayoutComponent } from './shared/layout/layout.component';
  import { DashboardComponent } from './components/dashboard/dashboard.component';
  import { RequestComponent } from './components/request/request.component';
  import { ControlComponent } from './shared/control/control.component';
  import { RegisterComponent } from './components/register/register.component'; // Add RegisterComponent here

  @NgModule({
    declarations: [
      AppComponent,
      LoginComponent,
      LayoutComponent,
      DashboardComponent,
      RequestComponent,
      ControlComponent,
      RegisterComponent, // Declare RegisterComponent here
    ],
    imports: [
      BrowserModule,
      BrowserAnimationsModule,
      MatButtonModule,
      MatTableModule,
      MatInputModule,
      MatCardModule,
      MatIconModule,
      MatSidenavModule,
      MatGridListModule,
      AppRoutingModule,
      MatDialogModule,
      MatPaginatorModule,
      MatToolbarModule,
      HttpClientModule,
      MatFormFieldModule, // Add MatFormFieldModule here
      FormsModule, // Add FormsModule
      ReactiveFormsModule // Add ReactiveFormsModule
    ],
    providers: [],
    bootstrap: [AppComponent],
  })
  export class AppModule {}
