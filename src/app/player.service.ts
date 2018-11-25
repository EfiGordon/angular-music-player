import {IObserver, ISubject} from './observer.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, tap } from 'rxjs/operators';
@Injectable()
export class PlayerService implements ISubject {

  songs: any[] = [
    {
      title: 'Lukas Graham - Mama Said',
      id: 'HdAkYCyCZv8',
      isActive: false,

    },
    {
      id: 'VDvr08sCPOc',
      title: 'Remember The Name (Official Video) - Fort Minor',
      isActive: false
    },
    {
      title: 'Rag\'n\'Bone Man - Human',
      id: 'L3wKzyIN1yk',
      isActive: false,
    },
    {
      title: 'Pink Floyd - The Gnome',
      id: 'Wk7fezaruTk',
      isActive: false,
    }

  ];
  currentSong = this.songs[0];
  private observers: IObserver[] = [];
  songsUpdated = new Subject();

  constructor(private http: HttpClient) {
    this.updateLyrics();
  }
  updateLyrics() {
    for(let song of this.songs) {
      this.getLyricsById(song.id).subscribe((data) => {
        // const keys = data.headers.keys();
        // this.headers = keys.map(key =>
        //   `${key}: ${data.headers.get(key)}`);
          if(data) {

           // let newString = data.replace(/↵/g, "<br/>");

            song.lyrics = data;
            console.dir(data);
          }
        }
      );
    }
  }

  getLyricsById(songid) {
    const api_url = 'api/v1/song/by-youtube-id/	';
    return this.http.get(
      'https://musicdemons.com/' + api_url + songid + '/lyrics', { responseType: 'text' });
  }

  getSongs() {
    return [...this.songs];
  }

  getTitleById(songid) {
    return this.http.get('https://musicdemons.com/api/v1/song/by-youtube-id/' + songid);
  }


  addSong(songYotubeId: string) {
    let temp = {
      id: songYotubeId,
      title: '',
      isActive: false
    }

    this.getTitleById(songYotubeId).subscribe(
      (data)=> {
        if (data !== undefined) {
          temp['title'] = data[0]['title'];
          this.songs.push(temp);
          this.updateLyrics();
          this.songsUpdated.next(); //trigger a new fetch
        }
      },
      error => {
        console.log('error fetching title.')
      }
    );

  }

  playOrPauseSong(obj) {
    if (obj !== null || obj !== undefined) {
      if (obj.msg.includes('PLAY')) {

        // update isActive
        this.currentSong.isActive = false;
        this.currentSong = obj.song;
        this.currentSong.isActive = true;

        // update the song in array
        const index = this.songs.findIndex(x => x.id === obj.song.id);
        this.songs[index] = this.currentSong;

        // notify about change in array
        this.songsUpdated.next();

        // notify top-bar to play the song
        this.notifyObservers(obj);
      } else if (obj.msg.includes('PAUSE')) {
        this.currentSong = obj.song;
        this.currentSong.isActive = false;
        // update the song in array
        const index = this.songs.findIndex(x => x.id === obj.song.id);
        this.songs[index] = this.currentSong;

        // notify about change in array
        this.songsUpdated.next();

        // notify top-bar to pause the song
        this.notifyObservers(obj);
      } else {
        console.log(obj.msg + ' message is not recognized');
      }
    }

  }

  playNextSong() {
    console.log('playing next song')
    const currentSongIndex = this.songs.findIndex(x => x.id === this.currentSong.id);
    if (currentSongIndex+1 < this.songs.length ) {

      const exampleMsg = {
        msg: 'PLAYER::PLAY',
        song: {
          ...this.songs[currentSongIndex + 1]
        }
      };
      this.playOrPauseSong(exampleMsg);
    } else {
      console.log('end of list');
    }
  }

  getCurrentSong() {
    return {...this.currentSong};
  }

  deleteSong(song) {
    this.songs = this.songs.filter(p=> p.id !== song.id);
    this.songsUpdated.next();
  }

  notifyObservers(obj) {
    for (let observer of this.observers) {
      observer.update(obj);
    }
  }

  registerObserver(o: IObserver) {
    this.observers.push(o);
  }

  removeObserver(o: IObserver) {
    const index = this.observers.indexOf(o);
    this.observers.splice(index, 1);
  }


}
