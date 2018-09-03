
# Connected Animation for Ionic Framework
Easily add Connected Animation (in UWP) or Shared Element Transition (in Android) to your elements.

# Example Project
[Here is an example](example)


# Setup

1. install via npm:
```
npm i ng-ionic-connectedanim@latest --save
```
2. Import ConnectedAnimationModule in you module
```typescript
import { ConnectedAnimationModule } from "ng-ionic-connectedanim";

@NgModule({
    imports: [
        ConnectedAnimationModule.forRoot(),
        ....
    ]
})
export class AppModule { }
```


# Usage
## 1. Basic example. as easy as:
In Page1.html:
```html
<img [src]="image" [animStart]="'animation-cover'">
<button (click)="push()">Push page2</button>
```
Page1.ts:
```javascript
    push() {
        this.navCtrl.push('Page2');
    }
```

Page2.html:
```html
<img [src]="image" [animEnd]="'animation-cover'">
```

## 2. Multiple connected animation
Page1.html:
```html
<img [src]="image" [animStart]="'anim-image'">
<p class="title" [animStart]="'anim-title'">
<button (click)="push()">Push page2</button>
```
Page1.ts:
```javascript
    push() {
        this.navCtrl.push('Page2');
    }
```
Page2.html:
```html
<img [src]="image" [animEnd]="'anim-image'">
<p class="title" [animEnd]="'anim-title'">
```

**Note:** If you want to use any element other than `img`, the `animStart` element and `animEnd` must be identical in font-*, width, height and text-align, otherwise the animation will not work well.

![Example 1](uploads/preview1.gif)

## 3. Multiple Items as 'animStart'
When you have a list of items in the first page, it is important to pass the element index before navigate to the second page, so animation can be played correctly.
Also add `animItem` attribute to animated element.

Page1.html:
```html
<div *ngFor="let item of items; let i = index" (click)="pushPage(i)">
    <img [src]="item.image" [animStart]="'animation-image'" animItem>
</div>
```
Pgae1.ts:
```javascript
import {ConnectedAnimationService} from 'ng-ionic-connectedanim';
export class Page1 {
    constructor(private navCtrl: NavController,
                private connectedAnimationService: ConnectedAnimationService) {
    }

    pushPage(itemIndex) {
        // pass item index
        this.connectedAnimationService.setItemIndex(itemIndex, this);
        // then push page2
        this.navCtrl.push('Page2');
    }
}
```
Page2.html:
```html
<img [src]="image" [animEnd]="'animation-image'">
```

## 4. Manually play animation:
This is useful for elements in the same page.
set autoFire to false in `animOptions`:
```html
<img [src]="image" [animStart]="'animation1'" [animOptions]="{ autoFire: false }">
<button (click)="openModal()">Open</button>

<div class="my-modal">
    <img [src]="image" [animEnd]="'animation1'">
    <button (click)="closeModal()">Close</button>
</div>
```

```javascript
export class Page {
    constructor(private animationService: ConnectedAnimationService) {
    }

    openModal() {
        // first show your modal 
        // Make sure its 'style.display' is not 'none' before playing animation.


        //let itemIndex = 0; /* Send element index if you are using ngFor */
        this.animationService.playAnimations(this/*, itemIndex*/);
        // or play a specific animation by its name
        //this.animationService.playAnimation('animation1'/*, itemIndex*/);
    }

    closeModal() {
        this.animationService.playAnimationBack(this);
        // then hide the modal...
    }
}
```

![Example 2](uploads/preview2.gif)

# Options
You can pass animation options to `animStart' element.
```html
<img [animStart]="'animation1'" [animOptions]="options">
```

#### Options:
| Option | Desc.   |
| ------ | ------- |
| autoFire | Set autoFire to false to manually play the animation by calling animationService.playAnimation(), default is true. |
| type | Animation type, e.g.: 'ease', 'ease-in'... |
| delay | Animation delay. |
| duration | Animation duration. |
| targetRect | Target element ('animEnd' element) position or offset. |

<br>
