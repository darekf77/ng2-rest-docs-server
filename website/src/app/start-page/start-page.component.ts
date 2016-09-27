import { Component, OnInit } from '@angular/core';
import { TranslatePipe } from 'ng2-translate/ng2-translate';

@Component({
    selector: 'start-page',
    template: require('./start-page.component.html'),
    styles: [require('./start-page.component.scss')],
    pipes: [TranslatePipe]
    // providers: [LoginService]
})
export class StartPageComponent implements OnInit {
    constructor() { }

    ngOnInit() { }

}
