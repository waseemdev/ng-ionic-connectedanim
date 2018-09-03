import { Injectable } from '@angular/core';

@Injectable()
export class DataService {
    constructor() {
    }

    getDummyData(): any[] {
        let res = [];
        for (let index = 0; index < 40; index++) {
            res.push({
                id: index + 1,
                image: './assets/imgs/book' + ((index % 4) + 1) + '.png',
                title: 'book ' + (index + 1) + ' title'
            });
        }
        return res;
    }
}
