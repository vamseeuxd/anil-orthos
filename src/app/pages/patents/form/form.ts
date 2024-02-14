import { Component } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { ConferenceData } from '../../../providers/conference-data';
import { UserData } from '../../../providers/user-data';

@Component({
  selector: 'patent-form',
  styleUrls: ['./form.scss'],
  templateUrl: 'form.html'
})
export class FormPage {
  form: any;
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
        const patentId = this.route.snapshot.paramMap.get('patentId');
        for (const group of data.schedule[0].groups) {
          if (group && group.sessions) {
            for (const form of group.sessions) {
              if (form && form.id === patentId) {
                this.form = form;

                this.isFavorite = this.userProvider.hasFavorite(
                  this.form.name
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
    if (this.userProvider.hasFavorite(this.form.name)) {
      this.userProvider.removeFavorite(this.form.name);
      this.isFavorite = false;
    } else {
      this.userProvider.addFavorite(this.form.name);
      this.isFavorite = true;
    }
  }

  shareSession() {
    console.log('Clicked share form');
  }
}
