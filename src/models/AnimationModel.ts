

export class AnimationModel {
    name: string;
    start: {
        component: any,
        elements: HTMLElement[],
        data: { animatedPos: any, animatedElement: HTMLElement },
        isMultipleItems: boolean
    };
    end: { component: any, element: HTMLElement };
    options: AnimationOptions;
}

export interface AnimationOptions {
    autoFire?: boolean,
    duration?: number,
    type?: string,
    targetRect?: { top?, left?, width?, height?, right?, bottom?, offsetTop?, offsetLeft? },
    delay?: number
}
