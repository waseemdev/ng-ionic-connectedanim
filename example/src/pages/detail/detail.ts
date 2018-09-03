import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
    selector: 'page-detail',
    templateUrl: 'detail.html'
})
export class DetailPage {
    book;

    constructor(public navCtrl: NavController, navParams: NavParams) {
        this.book = navParams.data;
    }
}
