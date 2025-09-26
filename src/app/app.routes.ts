import { Routes } from '@angular/router';
import { EcommerceComponent } from './pages/dashboard/ecommerce/ecommerce.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { FormElementsComponent } from './pages/forms/form-elements/form-elements.component';
import { BasicTablesComponent } from './pages/tables/basic-tables/basic-tables.component';
import { BlankComponent } from './pages/blank/blank.component';
import { NotFoundComponent } from './pages/other-page/not-found/not-found.component';
import { AppLayoutComponent } from './shared/layout/app-layout/app-layout.component';
import { InvoicesComponent } from './pages/invoices/invoices.component';
import { LineChartComponent } from './pages/charts/line-chart/line-chart.component';
import { BarChartComponent } from './pages/charts/bar-chart/bar-chart.component';
import { AlertsComponent } from './pages/ui-elements/alerts/alerts.component';
import { AvatarElementComponent } from './pages/ui-elements/avatar-element/avatar-element.component';
import { BadgesComponent } from './pages/ui-elements/badges/badges.component';
import { ButtonsComponent } from './pages/ui-elements/buttons/buttons.component';
import { ImagesComponent } from './pages/ui-elements/images/images.component';
import { VideosComponent } from './pages/ui-elements/videos/videos.component';
import { SignInComponent } from './pages/auth-pages/sign-in/sign-in.component';
import { SignUpComponent } from './pages/auth-pages/sign-up/sign-up.component';
import { CalenderComponent } from './pages/calender/calender.component';
import { AddTeamMemberComponent } from './pages/team/add-team-member/add-team-member.component';
import { ListingTeamMemberComponent } from './pages/team/listing-team-member/listing-team-member.component';
import { EditTeamMemberComponent } from './pages/team/edit-team-member/edit-team-member.component';
import { ListingArtistComponent } from './pages/artist/listing-artist/listing-artist.component';
import { AddArtistComponent } from './pages/artist/add-artist/add-artist.component';
import { EditArtistComponent } from './pages/artist/edit-artist/edit-artist.component';
import { ListingDiscographyComponent } from './pages/discography/listing-discography/listing-discography.component';
import { AddDiscographyComponent } from './pages/discography/add-discography/add-discography.component';
import { EditDiscographyComponent } from './pages/discography/edit-discography/edit-discography.component';
import { ListingNewsComponent } from './pages/news/listing-news/listing-news.component';
import { AddNewsComponent } from './pages/news/add-news/add-news.component';
import { EditNewsComponent } from './pages/news/edit-news/edit-news.component';
import { ListingUserComponent } from './pages/users/listing-user/listing-user.component';
import { AddUserComponent } from './pages/users/add-user/add-user.component';
import { EditUserComponent } from './pages/users/edit-user/edit-user.component';
import { AuthGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
  {
    path:'',
    component:AppLayoutComponent,
    canActivate: [AuthGuard],
    children:[
      // {
      //   path: '',
      //   component: EcommerceComponent,
      //   pathMatch: 'full',
      //   title:
      //     'Angular Ecommerce Dashboard | Flashbang',
      // },
      // {
      //   path:'calendar',
      //   component:CalenderComponent,
      //   title:'Angular Calender | Flashbang'
      // },
      {
        path:'profile',
        component:ProfileComponent,
        title:'Profile Dashboard | Flashbang'
      },
      // {
      //   path:'form-elements',
      //   component:FormElementsComponent,
      //   title:'Angular Form Elements Dashboard | Flashbang'
      // },
      // {
      //   path:'basic-tables',
      //   component:BasicTablesComponent,
      //   title:'Angular Basic Tables Dashboard | Flashbang'
      // },
      // {
      //   path:'blank',
      //   component:BlankComponent,
      //   title:'Angular Blank Dashboard | Flashbang'
      // },
      // // support tickets
      // {
      //   path:'invoice',
      //   component:InvoicesComponent,
      //   title:'Angular Invoice Details Dashboard | Flashbang'
      // },
      // {
      //   path:'line-chart',
      //   component:LineChartComponent,
      //   title:'Angular Line Chart Dashboard | Flashbang'
      // },
      // {
      //   path:'bar-chart',
      //   component:BarChartComponent,
      //   title:'Angular Bar Chart Dashboard | Flashbang'
      // },
      // {
      //   path:'alerts',
      //   component:AlertsComponent,
      //   title:'Angular Alerts Dashboard | Flashbang'
      // },
      // {
      //   path:'avatars',
      //   component:AvatarElementComponent,
      //   title:'Angular Avatars Dashboard | Flashbang'
      // },
      // {
      //   path:'badge',
      //   component:BadgesComponent,
      //   title:'Angular Badges Dashboard | Flashbang'
      // },
      // {
      //   path:'buttons',
      //   component:ButtonsComponent,
      //   title:'Angular Buttons Dashboard | Flashbang'
      // },
      // {
      //   path:'images',
      //   component:ImagesComponent,
      //   title:'Angular Images Dashboard | Flashbang'
      // },
      // {
      //   path:'videos',
      //   component:VideosComponent,
      //   title:'Angular Videos Dashboard | Flashbang'
      // },
      {
        path: '',
        redirectTo: 'team/listing',
        pathMatch: 'full'   // 🔑 Important: prevents partial match issues
      },
      {
        path:'team/listing',
        component:ListingTeamMemberComponent,
        title:'Angular Videos Dashboard | Flashbang'
      },
      {
        path:'team/add',
        component:AddTeamMemberComponent,
        title:'Angular Videos Dashboard | Flashbang'
      },
      {
        path:'team/edit/:id',
        component:EditTeamMemberComponent,
        title:'Angular Videos Dashboard | Flashbang'
      },
      {
        path:'artist/listing',
        component:ListingArtistComponent,
        title:'Angular Videos Dashboard | Flashbang'
      },
      {
        path:'artist/add',
        component:AddArtistComponent,
        title:'Angular Videos Dashboard | Flashbang'
      },
      {
        path:'artist/edit/:id',
        component:EditArtistComponent,
        title:'Angular Videos Dashboard | Flashbang'
      },
      {
        path:'discography/listing',
        component:ListingDiscographyComponent,
        title:'Angular Videos Dashboard | Flashbang'
      },
      {
        path:'discography/add',
        component:AddDiscographyComponent,
        title:'Angular Videos Dashboard | Flashbang'
      },
      {
        path:'discography/edit/:id',
        component:EditDiscographyComponent,
        title:'Angular Videos Dashboard | Flashbang'
      },
      {
        path:'news/listing',
        component:ListingNewsComponent,
        title:'Angular Videos Dashboard | Flashbang'
      },
      {
        path:'news/add',
        component:AddNewsComponent,
        title:'Angular Videos Dashboard | Flashbang'
      },
      {
        path:'news/edit/:id',
        component:EditNewsComponent,
        title:'Angular Videos Dashboard | Flashbang'
      },
      {
        path:'users/listing',
        component:ListingUserComponent,
        title:'User Listing | Flashbang'
      },
      {
        path:'users/add',
        component:AddUserComponent,
        title:'Add User | Flashbang'
      },
      {
        path:'users/edit/:id',
        component:EditUserComponent,
        title:'Edit User | Flashbang'
      },
    ]
  },
  // auth pages
  {
    path:'sign-in',
    component:SignInComponent,
    title:'Sign In Dashboard | Flashbang'
  },
  {
    path:'sign-up',
    component:SignUpComponent,
    title:'Sign Up Dashboard | Flashbang'
  },
  // error pages
  {
    path:'**',
    component:NotFoundComponent,
    title:'NotFound Dashboard | Flashbang'
  },
];
