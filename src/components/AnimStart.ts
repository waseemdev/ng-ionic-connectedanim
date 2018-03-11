import { Directive, ElementRef, Input, ViewContainerRef } from '@angular/core';
import { ConnectedAnimationService } from "../providers/AnimService";
import { AnimationOptions } from '../models/AnimationModel';
import { App, NavController, Platform } from 'ionic-angular';

let indexes: { [name: string]: number } = { };

@Directive({
    selector: '[animStart]'
})
export class AnimationStartDirective {
    constructor(private elementRef: ElementRef,
                private animationService: ConnectedAnimationService,
                private viewContainerRef: ViewContainerRef,
                app: App,
                platform: Platform) {
        // since we can't inject App into a service!
        animationService.initEvents(app, platform.is('android'));

        let attr = (elementRef.nativeElement as HTMLElement).attributes.getNamedItem('animItem');
        if (attr) {
            this.index = indexes[attr.value] || 0;
            indexes[attr.value] = this.index + 1;
        }
    }

    private readonly index: number;

    private initAnim() {
        if (this.name) {
            this.animationService.addStartElement(this.name, this.elementRef.nativeElement, this.getComponent(), this.index);
        }
    }

    private getComponent(): any {
        return (this.viewContainerRef.injector as any).view.component;
    }

    ngOnDestroy() {
        this.animationService.clearCache(this.elementRef.nativeElement);
    }


    private _name : string;
    public get name() : string {
        return this._name;
    }
    @Input('animStart')
    public set name(v : string) {
        this._name = v;
        this.initAnim();
    }


    private _options : AnimationOptions;
    public get options() : AnimationOptions {
        return this._options;
    }
    @Input('animOptions')
    public set options(v : AnimationOptions) {
        this._options = v;
        this.animationService.setStartOption(this.getComponent(), v);
    }
}
