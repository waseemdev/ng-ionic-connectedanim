import { Injectable, Injector } from '@angular/core';
import { App } from "ionic-angular";
import { AnimationModel, AnimationOptions } from '../models/AnimationModel';
import { UIHelper } from '../utils/UIHelper';

@Injectable()
export class ConnectedAnimationService {
    private eventsInited;
    private readonly loadedViews: Map<any, boolean> = new  Map();
    private isAndroid: boolean;

    initEvents(app: App, isAndroid) {
        if (this.eventsInited) {
            return;
        }
        this.eventsInited = true;
        this.isAndroid = isAndroid;
        
        app.viewWillEnter.subscribe((view) => {
            try {
                this.startAnimation(true, view.instance, null);
            }
            catch (ex) {
            }
        });
        app.viewWillLeave.subscribe((view) => {
            try {
                this.startReversedAnimation(view.instance, true);
            }
            catch (ex) {
            }
        });
    }


    private readonly animations: { [name: string]: AnimationModel } = { };
    private readonly tempComponentOptions: Map<any, AnimationOptions> = new Map();
    private readonly clickedElementsIndex: { [name: string]: number } = { };
    private readonly uiHelper: UIHelper = new UIHelper();

    default: {
        animationType: string,
        animationDuration: number
    } = {
        animationType: 'ease',
        animationDuration: 250
    };

    clearCache(element: HTMLElement) {
        this.uiHelper.clearCache(element);
    }

    addStartElement(name: string, element: HTMLElement, component, index: number) {
        var anim: AnimationModel = this.getOrCreateAnim(name);
        if (!anim.start) {
            anim.start = { component: component, elements: [], data: null, isMultipleItems: false };
        }

        if (!!index || index === 0) {
            anim.start.elements[index] = element;
            anim.start.isMultipleItems = true;
        }
        else {
            anim.start.elements.push(element);
        }

        let options = this.tempComponentOptions.get(component);
        if (options) {
            anim.options = this.createOptions(options);
            this.tempComponentOptions.delete(component);
        }
    }

    setStartOption(component: any, options: AnimationOptions) {
        var anim: AnimationModel = this.findAnimations(false, a => a.start.component === component)[0];
        if (anim) {
            anim.options = this.createOptions(options);
        }
        else {
            this.tempComponentOptions.set(component, options);
        }
    }

    private createOptions(options: AnimationOptions): AnimationOptions {
        return Object.assign({}, options || {}, { autoFire: options ? ('autoFire' in options ? options.autoFire : true) : true });
    }

    addEndElement(name: string, element: HTMLElement, component) {
        var anim: AnimationModel = this.getOrCreateAnim(name);
        this.animations[name].end = { component: component, element: element };
        this.uiHelper.hideElement(element);
    }

    private getOrCreateAnim(name: string): AnimationModel {
        if (!(name in this.animations)) {
            this.animations[name] = new AnimationModel();
            this.animations[name].name = name;
            this.animations[name].options = { autoFire: true };
        }
        return this.animations[name];
    }

    setItemIndex(itemIndex: number = 0, component?: any, animationName?: string) {
        let anims = this.findAnimations(false, anim => anim.start.isMultipleItems && anim.start.component === component || anim.name === animationName);
        for (let index = 0; index < anims.length; index++) {
            this.clickedElementsIndex[anims[index].name] = itemIndex;
        }
    }

    playAnimation(animationName: string, itemIndex: number = 0) {
        this.setItemIndex(itemIndex, null, animationName);
        this.startAnimation(false, null, null, animationName);
    }

    playAnimations(component: any, itemIndex: number = 0) {
        this.setItemIndex(itemIndex, component);
        this.startAnimation(false, null, component, null);
    }

    playAnimationBack(component) {
        this.startReversedAnimation(component, false);
    }

    private startAnimation(autoFired, endComponent, startComponent, animationName?: string) {
        let anims = this.findAnimations(autoFired, anim => anim.name === animationName || anim.end && anim.end.component == endComponent || (anim.start.component === startComponent && anim.end && anim.end.component === startComponent));
        for (let i = 0; i < anims.length; i++) {
            let anim = anims[i];
            let startElement = anim.start.elements[anim.start.isMultipleItems ? this.clickedElementsIndex[anim.name] || 0 : 0];
            let targetRectOpt: any = anim.options.targetRect || {};
            // setTimeout(() => {
            // todo: recheck getBoundingClientRect sometimes get wrong values if element was none-displayed!
            let targetRect = anim.end.element.getBoundingClientRect();
            anim.start.data = this.uiHelper.startElementAnimation(
                startElement,
                anim.end.element,
                {
                    top: (targetRectOpt.top || (targetRect.top + (targetRectOpt.offsetTop || 0))) + (autoFired && this.isAndroid ? 16 /*40*/: 0),
                    left: targetRectOpt.left || (targetRect.left + (targetRectOpt.offsetLeft || 0)),
                    width: targetRectOpt.width || (targetRect.width),
                    height: targetRectOpt.height || (targetRect.height)
                },
                anim.options.duration || this.default.animationDuration,
                anim.options.type || this.default.animationType,
                anim.options.delay
            );
            // });
        }
    }

    private startReversedAnimation(endComponent, autoFired) {
        let anims = this.findAnimations(autoFired, anim => anim.end && anim.end.component === endComponent);
        for (let i = 0; i < anims.length; i++) {
            let anim = anims[i];
            let startElement = anim.start.elements[anim.start.isMultipleItems ? this.clickedElementsIndex[anim.name] || 0 : 0];
            this.uiHelper.startReversedElementAnimation(startElement, anim.end.element, anim.start.data.animatedElement, anim.start.data.animatedPos, anim.options.duration || this.default.animationDuration, anim.options.delay);
        }
    }

    private findAnimations(autoFired: boolean, predicate: (anim: AnimationModel) => boolean): AnimationModel[] {
        let res = [];
        for (let key in this.animations) {
            if (this.animations.hasOwnProperty(key)) {
                let anim = this.animations[key];
                if (anim.start && (!autoFired || autoFired && anim.options.autoFire) && predicate(anim)) {
                    res.push(anim);
                }
            }
        }
        return res;
    }
}
