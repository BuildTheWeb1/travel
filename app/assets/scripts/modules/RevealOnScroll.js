import throttle from 'lodash/throttle';
import debounce from 'lodash/debounce';

export default class RevealOnScroll {
    constructor(els, tresholdPercent) {
        this.itemsToReveal = els;
        this.tresholdPercent = tresholdPercent;
        this.browserHeight = window.innerHeight;
        this.hideInitialy();
        this.scrollThrottle = throttle(this.calcCaller, 200).bind(this);
        this.events();
    }

    events() {
        window.addEventListener('scroll', this.scrollThrottle);
        window.addEventListener('resize', debounce(() => {
            this.browserHeight = window.innerHeight;
        }, 333));
    }

    calcCaller() {
        this.itemsToReveal.forEach(el => {
            if (el.isReveald === false) {
                this.calculateIfScrolledTo(el);
            }
        });
    }

    calculateIfScrolledTo(el) {
        if (window.scrollY + this.browserHeight > el.offsetTop) {
            let scrollPercent = (el.getBoundingClientRect().y / this.browserHeight) * 100;

            if (scrollPercent < this.tresholdPercent) {
                el.classList.add('reveal-item--is-visible');
                el.isReveald = true;
                if (el.isLastItem) {
                    window.removeEventListener("scroll", this.scrollThrottle);
                }
            }
        }
    }

    hideInitialy() {
        this.itemsToReveal.forEach(el => {
            el.classList.add("reveal-item");
            el.isReveald = false;
        });
        this.itemsToReveal[this.itemsToReveal.length - 1].isLastItem = true;
    }
}