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
        pathMatch: 'full'  
      },
      {
        path:'event/listing',
        component:ListingEventComponent,
        title:'Listing Event | Lucky Draw'
      },
      {
        path:'event/create',
        component:CreateEventComponent,
        title:'Create Event | Lucky Draw'
      },
      {
        path:'event/edit/:id',
        component:EditEventComponent,
        title:'Edit Event | Lucky Draw'
      },
      {
        path:'event/view/:id',
        component:ViewEventComponent,
        title:'View Event | Lucky Draw'
      }
    ]
  },
  // auth pages
  {
    path:'sign-in',
    component:SignInComponent,
    title:'Sign In | Lucky Draw'
  },
  {
    path:'sign-up',
    component:SignUpComponent,
    title:'Sign Up | Lucky Draw'
  },

  {
    path:'draw/:id',
    component:DrawComponent,
    title:'Draw | Lucky Draw'
  },
  {
    path:'spin/:id',
    component:SpinComponent,
    title:'Spin | Lucky Draw'
  },
  // error pages
  {
    path:'**',
    component:NotFoundComponent,
    title:'Page Not Found | Lucky Draw'
  },
  
];
