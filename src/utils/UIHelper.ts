
export class UIHelper {
    private readonly cache: Map<HTMLElement, HTMLElement> = new Map();
    // review
    private enableCaching: boolean = false;


    hideElement(element: HTMLElement) {
        element.style.opacity = '0';
    }

    showElement(element: HTMLElement) {
        element.style.opacity = '1';
    }

    clearCache(element: HTMLElement) {
        this.cache.forEach((anim, start) => {
            if (start === element) {
                document.body.removeChild(anim);
            }
        });
    }

    startReversedElementAnimation(startElement: HTMLElement,
                                endElement: HTMLElement,
                                animatedElement: HTMLElement,
                                targetPos: {top,left,width,height},
                                duration: number,
                                delay: number) {
        this.setTranslateAndScale(animatedElement, startElement.getBoundingClientRect(), endElement.getBoundingClientRect());
        
        setTimeout(() => {
            animatedElement.style.transform = '';
            this.showElement(animatedElement);
            this.hideElement(endElement);

            setTimeout(() => {
                this.showElement(startElement);
                if (this.enableCaching) {
                    this.hideElement(animatedElement);
                    animatedElement.style.display = 'none';
                }
                else {
                    document.body.removeChild(animatedElement);
                }
            }, duration);
        }, delay);
    }

    startElementAnimation(startElement: HTMLElement,
                        endElement: HTMLElement,
                        targetPos: {top,left,width,height},
                        duration: number,
                        animationType: string,
                        delay: number): { animatedPos: any, animatedElement: HTMLElement } {
        let animatedElement: HTMLElement;
        let hasCache = animatedElement = this.cache.get(startElement);
        if (!this.enableCaching || !hasCache) {
            animatedElement = startElement.cloneNode(true) as HTMLElement;
            this.synchronizeCssStyles(startElement, animatedElement, true);
            if (this.enableCaching) {
                this.cache.set(startElement, animatedElement);
            }
        }

        let animatedPos = startElement.getBoundingClientRect();

        animatedElement.style.display = 'block';
        animatedElement.style.position = 'absolute';
        animatedElement.style.zIndex = '100000';
        animatedElement.style.transition = `transform ${duration}ms ${animationType}` + (delay ? ` ${delay}ms` : '');
        animatedElement.style.transformOrigin = 'left top';
        animatedElement.style.left = animatedPos.left + 'px';
        animatedElement.style.top = animatedPos.top + 'px';

        if (!hasCache) {
            document.body.appendChild(animatedElement);
        }

        this.hideElement(startElement);
        this.hideElement(endElement);
        this.showElement(animatedElement);

        setTimeout(() => {
            this.setTranslateAndScale(animatedElement, animatedPos, targetPos);

            setTimeout(() => {
                this.showElement(endElement);
                this.hideElement(animatedElement);
            }, duration);
        });

        return { animatedPos: animatedPos, animatedElement: animatedElement };
    }

    private setTranslateAndScale(animatedElement: HTMLElement, startPos: {top,left,width,height}, targetPos: {top,left,width,height}) {
        let scaleX = targetPos.width / startPos.width;
        let scaleY = targetPos.height / startPos.height;
        let translateY = targetPos.top - startPos.top;
        let translateX = targetPos.left - startPos.left;
        animatedElement.style.transform = 'translateX(' + translateX + 'px) translateY(' + translateY + 'px) scaleX(' + scaleX + ') scaleY(' + scaleY + ')';
    }

    private synchronizeCssStyles(src, destination, recursively) {
        // if recursively = true, then we assume the src dom structure and destination dom structure are identical (ie: cloneNode was used)

        // window.getComputedStyle vs document.defaultView.getComputedStyle
        // @TBD: also check for compatibility on IE/Edge
        destination.style.cssText = document.defaultView.getComputedStyle(src, "").cssText;

        if (recursively) {
            var vSrcElements = src.getElementsByTagName("*");
            var vDstElements = destination.getElementsByTagName("*");

            for (var i = vSrcElements.length; i--;) {
                var vSrcElement = vSrcElements[i];
                var vDstElement = vDstElements[i];
                // console.log(i + " >> " + vSrcElement + " :: " + vDstElement);
                vDstElement.style.cssText = document.defaultView.getComputedStyle(vSrcElement, "").cssText;
            }
        }
    }
}
