import { Routes } from '@angular/router';
import { NotFoundComponent } from './pages/other-page/not-found/not-found.component';
import { AppLayoutComponent } from './shared/layout/app-layout/app-layout.component';
import { SignInComponent } from './pages/auth-pages/sign-in/sign-in.component';
import { SignUpComponent } from './pages/auth-pages/sign-up/sign-up.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { DrawComponent } from './pages/draw/draw.component';
import { ListingEventComponent } from './pages/event/listing-event/listing-event.component';
import { CreateEventComponent } from './pages/event/create-event/create-event.component';
import { EditEventComponent } from './pages/event/edit-event/edit-event.component';
import { AddDiscographyComponent } from './pages/discography/add-discography/add-discography.component';
import { FormElementsComponent } from './pages/forms/form-elements/form-elements.component';
import { BasicTablesComponent } from './pages/tables/basic-tables/basic-tables.component';
import { ViewEventComponent } from './pages/event/view-event/view-event.component';
import { SpinComponent } from './pages/spin/spin.component';

export const routes: Routes = [
  {
    path:'',
    component:AppLayoutComponent,
    canActivate: [AuthGuard],
    children:[
      {
        path: '',
        redirectTo: 'event/listing',
        pathMatch: 'full'   // 🔑 Important: prevents partial match issues
      },
      {
        path:'event/listing',
        component:ListingEventComponent,
        title:'Team Member Listing | Flashbang'
      },
      {
        path:'event/create',
        component:CreateEventComponent,
        title:'Add Team Member | Flashbang'
      },
      {
        path:'event/edit/:id',
        component:EditEventComponent,
        title:'Edit Team Member | Flashbang'
      },
      {
        path:'event/view/:id',
        component:ViewEventComponent,
        title:'Edit Team Member | Flashbang'
      },
      {
        path:'event/test',
        component:AddDiscographyComponent,
        title:'Add Team Member | Flashbang'
      },
      {
        path:'event/form',
        component:FormElementsComponent,
        title:'Add Team Member | Flashbang'
      },
      {
        path:'event/table',
        component:BasicTablesComponent,
        title:'Add Team Member | Flashbang'
      },
    ]
  },
  // auth pages
  {
    path:'sign-in',
    component:SignInComponent,
    title:'Sign In | Flashbang'
  },
  {
    path:'sign-up',
    component:SignUpComponent,
    title:'Sign Up | Flashbang'
  },

  {
    path:'draw/:id',
    component:DrawComponent,
    title:'Draw | Flashbang'
  },
  {
    path:'spin/:id',
    component:SpinComponent,
    title:'Draw | Flashbang'
  },
  // error pages
  {
    path:'**',
    component:NotFoundComponent,
    title:'Page Not Found | Flashbang'
  },
  
];
