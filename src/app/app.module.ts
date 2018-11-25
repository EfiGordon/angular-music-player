import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { PlayerComponent } from './player/player.component';
import { MaterialModule } from './material.module';
import { PlayerService } from './player.service';
import { YoutubePlayerModule } from 'ngx-youtube-player';
import { HttpClientModule } from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { AboutComponent } from './about/about.component';
import {AppRoutingModule} from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    TopBarComponent,
    PlayerComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    YoutubePlayerModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    PlayerService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
