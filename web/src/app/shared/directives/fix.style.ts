import { Directive, Input, ElementRef } from '@angular/core';

@Directive({
    selector: '[fixStyle]'
})

export class FixStyleDirective {
    @Input() fixStyle: string;
    constructor( private el: ElementRef) { }
    ngOnInit() {
        var array = this.fixStyle.split(' ');
        array.forEach(item => {
            if (item && item != '')
                applyFixCss(this.el.nativeElement, 'body', item);
        });

    }
}
function applyFixCss(el, limit, name) {
    var matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
    while (el) {
        
        if (!el.classList.contains(name)) {
            el.classList.add(name);
        }
        if (matchesSelector.call(el, limit)) {
            return;
        }
        el = el.parentElement;
    }
}