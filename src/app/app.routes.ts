import { Routes } from '@angular/router';
import { ProfileComponent } from './pages/profile/profile.component';
import { NotFoundComponent } from './pages/other-page/not-found/not-found.component';
import { AppLayoutComponent } from './shared/layout/app-layout/app-layout.component';
import { SignInComponent } from './pages/auth-pages/sign-in/sign-in.component';
import { SignUpComponent } from './pages/auth-pages/sign-up/sign-up.component';
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
import { SortingArtistComponent } from './pages/artist/sorting-artist/sorting-artist.component';
import { SortingTeamMemberComponent } from './pages/team/sorting-team-member/sorting-team-member.component';

export const routes: Routes = [
  {
    path:'',
    component:AppLayoutComponent,
    canActivate: [AuthGuard],
    children:[
      {
        path:'profile',
        component:ProfileComponent,
        title:'Profile Dashboard | Flashbang'
      },
      {
        path: '',
        redirectTo: 'team/listing',
        pathMatch: 'full'   // 🔑 Important: prevents partial match issues
      },
      {
        path:'team/listing',
        component:ListingTeamMemberComponent,
        title:'Team Member Listing | Flashbang'
      },
      {
        path:'team/add',
        component:AddTeamMemberComponent,
        title:'Add Team Member | Flashbang'
      },
      {
        path:'team/edit/:id',
        component:EditTeamMemberComponent,
        title:'Edit Team Member | Flashbang'
      },
      {
        path:'team/sorting',
        component:SortingTeamMemberComponent,
        title:'Team Sorting | Flashbang'
      },
      {
        path:'artist/listing',
        component:ListingArtistComponent,
        title:'Aritst Listing | Flashbang'
      },
      {
        path:'artist/add',
        component:AddArtistComponent,
        title:'Add Aritst | Flashbang'
      },
      {
        path:'artist/edit/:id',
        component:EditArtistComponent,
        title:'Edit Aritst | Flashbang'
      },
      {
        path:'artist/sorting',
        component:SortingArtistComponent,
        title:'Aritst Sorting | Flashbang'
      },
      {
        path:'discography/listing',
        component:ListingDiscographyComponent,
        title:'Discography Listing | Flashbang'
      },
      {
        path:'discography/add',
        component:AddDiscographyComponent,
        title:'Add Discography | Flashbang'
      },
      {
        path:'discography/edit/:id',
        component:EditDiscographyComponent,
        title:'Edit Discography | Flashbang'
      },
      {
        path:'news/listing',
        component:ListingNewsComponent,
        title:'News Listing | Flashbang'
      },
      {
        path:'news/add',
        component:AddNewsComponent,
        title:'Add News | Flashbang'
      },
      {
        path:'news/edit/:id',
        component:EditNewsComponent,
        title:'Edit News | Flashbang'
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
    title:'Sign In | Flashbang'
  },
  {
    path:'sign-up',
    component:SignUpComponent,
    title:'Sign Up | Flashbang'
  },
  // error pages
  {
    path:'**',
    component:NotFoundComponent,
    title:'Page Not Found | Flashbang'
  },
];
