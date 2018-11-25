import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PlayerComponent} from './player/player.component';
import {AboutComponent} from './about/about.component';

const routes: Routes = [
  {path: '',component: PlayerComponent},
  {path: 'about',component: AboutComponent},
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
