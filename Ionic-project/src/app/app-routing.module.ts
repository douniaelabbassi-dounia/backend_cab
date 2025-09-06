import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PreloadAllModules } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./auth/sign-in/sign-in.module').then(m => m.SignInPageModule)
  },
  {
    path: 'onboarding',
    loadChildren: () => import('./onboarding/onboarding.module').then(m => m.OnboardingPageModule)
  },
  {
    path: 'sign-up',
    loadChildren: () => import('./auth/sign-up/sign-up.module').then(m => m.SignUpPageModule)
  },
  {
    path: 'sign-in',
    loadChildren: () => import('./auth/sign-in/sign-in.module').then(m => m.SignInPageModule)
  },
  {
    path: 'pub',
    loadChildren: () => import('./pub/pub.module').then(m => m.PubPageModule)
  },
  {
    path: 'gpsaccess',
    loadChildren: () => import('./gpsaccess/gpsaccess.module').then(m => m.GPSAccessPageModule)
  },
  {
    path: 'map',
    loadChildren: () => import('./map/map.module').then(m => m.MapPageModule)
  },

  {
    path: 'profil',
    loadChildren: () => import('./profile/profil/profil.module').then(m => m.ProfilPageModule)
  },
  {
    path: 'gestion-amis',
    loadChildren: () => import('./profile/gestion-amis/gestion-amis.module').then(m => m.GestionAmisPageModule)
  },
  {
    path: 'avis',
    loadChildren: () => import('./feedback/avis/avis.module').then(m => m.AvisPageModule)
  },
  {
    path: 'aide',
    loadChildren: () => import('./feedback/aide/aide.module').then(m => m.AidePageModule)
  },
  {
    path: 'premium',
    loadChildren: () => import('./premum/premium/premium.module').then(m => m.PremiumPageModule)
  },
  {
    path: 'premium-confirmation',
    loadChildren: () => import('./premum/premium-confirmation/premium-confirmation.module').then(m => m.PremiumConfirmationPageModule)
  },
  {
    path: 'faq',
    loadChildren: () => import('./feedback/faq/faq.module').then(m => m.FaqPageModule)
  },
  {
    path: 'setting',
    loadChildren: () => import('./setting/setting.module').then(m => m.SettingPageModule)
  },
  {
    path: 'splash-screen',
    loadChildren: () => import('./splash-screen/splash-screen.module').then(m => m.SplashScreenPageModule)
  },
  {
    path: 'update-evenement/:id',
    loadChildren: () => import('./update-evenement/update-evenement.module').then(m => m.UpdateEvenementPageModule)
  },
  {
    path:"update-sos/:id",
    loadChildren:() => import("./update-sos/update-sos.module").then(m => m.UpdateSosPageModule)
  },
  {
    path: 'update-note/:id',
    loadChildren: () => import('./update-note/update-note.module').then( m => m.UpdateNotePageModule)
  },

  {
    path: 'update-profil',
    loadChildren: () => import('./profile/update-profil/update-profil.module').then(m => m.UpdateProfilPageModule)
  },
  {
    path: 'thanks-page',
    loadChildren: () => import('./premum/thanks-page/thanks-page.module').then(m => m.ThanksPagePageModule)
  },
  {
    path: 'password-forgotten',
    loadChildren: () => import('./auth/password-forgotten/password-forgotten.module').then(m => m.PasswordForgottenPageModule)
  },
  {
    path: 'new-password',
    loadChildren: () => import('./auth/new-password/new-password.module').then(m => m.NewPasswordPageModule)
  },
  {
    path: 'mention-legal',
    loadChildren: () => import('./mention-legal/mention-legal.module').then(m => m.MentionLegalPageModule)
  },

  {
    path: 'sos',
    loadChildren: () => import('./sos/sos.module').then(m => m.SosPageModule)
  },
  {
    path: 'info',
    loadChildren: () => import('./info/info.module').then(m => m.InfoPageModule)
  },
  { path: '', redirectTo: 'menu', pathMatch: 'full' },
  { path: 'aeroports', loadChildren: () => import('./aeroport/aeroport.module').then(m => m.AeroportPageModule) },
  {
    path: 'aeroport-modal',
    loadChildren: () => import('./aeroport-modal/aeroport-modal.module').then(m => m.AeroportModalPageModule)
  },
  {
    path: 'aeroport-details',
    loadChildren: () =>
      import('./aeroport-details/aeroport-details.module').then(
        (m) => m.AeroportDetailsModule
      ),
  },
  {
    path: 'aeroport-attente',
    loadChildren: () =>
      import('./aeroport-ifram-modal/aeroport-ifram-route.module').then(
        (m) => m.AeroportIframRouteModule
      ),
  }
  ,
  {
    path: 'list-evenement',
    loadChildren: () =>
      import('./list-evenement/list-evenement.module').then(
        (m) => m.ListEvenementPageModule
      ),
  },
  {
    path: 'list-notes',
    loadChildren: () => import('./list-notes/list-notes.module').then( m => m.ListNotesPageModule)
  },
  



];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
