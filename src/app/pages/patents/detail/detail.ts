import { Component } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { ConferenceData } from '../../../providers/conference-data';
import { UserData } from '../../../providers/user-data';

@Component({
  selector: 'patent-detail',
  styleUrls: ['./detail.scss'],
  templateUrl: 'detail.html'
})
export class DetailPage {
  detail: any;
  isFavorite = false;
  defaultHref = '';

  constructor(
    private dataProvider: ConferenceData,
    private userProvider: UserData,
    private route: ActivatedRoute
  ) { }

  ionViewWillEnter() {
    this.dataProvider.load().subscribe((data: any) => {
      if (data && data.schedule && data.schedule[0] && data.schedule[0].groups) {
        const sessionId = this.route.snapshot.paramMap.get('sessionId');
        for (const group of data.schedule[0].groups) {
          if (group && group.sessions) {
            for (const detail of group.sessions) {
              if (detail && detail.id === sessionId) {
                this.detail = detail;

                this.isFavorite = this.userProvider.hasFavorite(
                  this.detail.name
                );

                break;
              }
            }
          }
        }
      }
    });
  }

  ionViewDidEnter() {
    this.defaultHref = `/app/tabs/patents`;
  }

  sessionClick(item: string) {
    console.log('Clicked', item);
  }

  toggleFavorite() {
    if (this.userProvider.hasFavorite(this.detail.name)) {
      this.userProvider.removeFavorite(this.detail.name);
      this.isFavorite = false;
    } else {
      this.userProvider.addFavorite(this.detail.name);
      this.isFavorite = true;
    }
  }

  shareSession() {
    console.log('Clicked share detail');
  }
}
