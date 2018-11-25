import {Component, Injectable, OnDestroy, OnInit} from '@angular/core';
import {IObserver, ISubject} from '../observer.model';
import {TopBarComponent} from '../top-bar/top-bar.component';
import {PlayerService} from '../player.service';
import {Subscription } from 'rxjs';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit, OnDestroy, IObserver {
  currentSong;
  songs = [];
  private songsSubscription: Subscription;
  constructor(private playerService: PlayerService) {

  }

  ngOnInit() {

    this.currentSong = this.playerService.getCurrentSong();
    this.songs = this.playerService.getSongs();
    this.playerService.registerObserver(this);

    this.songsSubscription =  this.playerService.songsUpdated.subscribe(() => {
      this.songs = this.playerService.getSongs();


    });
  }

  update(update: any) {
    this.currentSong = update.song;
  }

  ngOnDestroy() {
    this.songsSubscription.unsubscribe();
  }

  playClicked(song){

    const exampleMsg = {
      msg: 'PLAYER::PLAY',
      song: {
        ...song
      }
    }

    if(this.currentSong.id === song.id && !this.currentSong.isActive) {
      this.playerService.playOrPauseSong(exampleMsg);

    } else if(this.currentSong.id !== song.id) {
      this.playerService.playOrPauseSong(exampleMsg);
    } else {

    }
  }
  onAddSong(f) {
    if (f.valid) {
      this.playerService.addSong(f.value.songID);
    }
  }

  deleteClicked(song) {
    this.playerService.deleteSong(song);
  }

  pauseClicked(song) {
    const exampleMsg = {
      msg: 'PLR::PAUSE',
      song: {
        ...song
      }
    }

    if (this.currentSong.id === song.id && this.currentSong.isActive) {
      this.playerService.playOrPauseSong(exampleMsg);
    }
  }



}
