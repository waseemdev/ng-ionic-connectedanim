import { Component } from '@angular/core';
import { NavController, App } from 'ionic-angular';
import { ConnectedAnimationService } from "ng-ionic-connectedanim";
import { DataService } from '../../services/DataService';
import { DetailPage } from '../detail/detail';

@Component({
    selector: 'page-list',
    templateUrl: 'list.html'
})
export class ListPage {
    items: any[];

    constructor(public navCtrl: NavController,
                private dataService: DataService,
                private app: App,
                private connectedAnimationService: ConnectedAnimationService) {
        this.items = this.dataService.getDummyData();
    }

    gotoDetails(book, i) {
        this.connectedAnimationService.setItemIndex(i, this);
        this.app.getRootNavs()[0].push(DetailPage, book);
    }
}
