import { Directive, ElementRef, Input, ViewContainerRef } from '@angular/core';
import { ConnectedAnimationService } from "../providers/AnimService";
import { Events, NavController } from 'ionic-angular';

@Directive({
    selector: '[animEnd]'
})
export class AnimationEndDirective {
    constructor(private elementRef: ElementRef,
                private animationService: ConnectedAnimationService,
                private viewContainerRef: ViewContainerRef) {
    }


    private _name : string;
    public get name() : string {
        return this._name;
    }
    @Input('animEnd')
    public set name(v : string) {
        this._name = v;
        this.animationService.addEndElement(v, this.elementRef.nativeElement, (this.viewContainerRef.injector as any).view.component);
    }
}
