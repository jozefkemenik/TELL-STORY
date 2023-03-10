import { Component, OnInit, ViewEncapsulation, NgZone, Input, Output, EventEmitter } from '@angular/core';



@Component({
  selector: 'app-infinite-scroll',
  templateUrl: './infinite-scroll.component.html',
  styleUrls: ['./infinite-scroll.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class InfiniteScrollComponent {
  @Input() total = 0;
  @Input() loadedTotal = 0;
  @Input() loading:boolean;
  @Output() onLoad = new EventEmitter();
  
  constructor(private zone: NgZone) {
  }


  ngAfterViewInit(){
      this.zone.run(() => {
        setTimeout(()=>{
        this.onLoad.emit(null);
       });
      });
    }

  onReachEnd(e){
    if(!this.loading && (this.total>this.loadedTotal || this.total==0)){
      this.zone.run(() => {
        this.onLoad.emit(e);
      });
    }
  }
}
