import { Component, OnInit } from '@angular/core';
import {PlayerService} from '../player.service';
import {IObserver} from '../observer.model';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit, IObserver {

  currentSong = {
    id: 'none',
    title: 'noneTitle',
    isActive: false
  };

  player: YT.Player;
  private id = 'qDuKsiwS5xw';
  showPlayer: boolean = true;
  constructor(private playerService: PlayerService) {
  }

  ngOnInit() {
    this.playerService.registerObserver(this); // register as an observer for play/pause updates.
    this.currentSong = this.playerService.getCurrentSong(); // init: gets first song of array


  }

  update(update: any) {
    this.currentSong = update.song;
    if (update.msg.includes('PLAY')) {
      this.play();
    }
    if (update.msg.includes('TOP-BAR::PAUSE')) {
      this.pause();
    }
    if (update.msg.includes('PLR::PAUSE')) {
      this.pauseClicked(update.song);
    }

  }
  playNextSong() {
    this.playerService.playNextSong();

  }

  play() {
    console.log('play():');
    console.dir(this.currentSong);
    this.player.loadVideoById(this.currentSong.id, this.currentSong['time'] || null);
  }

  pause() {
    this.player.pauseVideo();
  }

  playClicked(song) {
    const exampleMsg = {
      msg: 'TOP-BAR::PLAY',
      song: song
    }
    this.playerService.playOrPauseSong(exampleMsg);
  }

  pauseClicked(song) {
    const exampleMsg = {
      msg: 'TOP-BAR::PAUSE',
      song: {...song,
        time: this.player.getCurrentTime()},
    }
    this.playerService.playOrPauseSong(exampleMsg);
  }

  savePlayer(player) {
    this.player = player;
    // console.log('player instance', player);
  }
  onStateChange(event) {
    console.log('player state', event.data);
  }

}
