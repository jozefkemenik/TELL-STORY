import { Component, OnInit, Input, Output, ViewEncapsulation, EventEmitter, Renderer2,  HostListener } from '@angular/core';
import { Group, SubGroup, Widget} from '../menu.model';


@Component({
  selector: 'app-vertical-menu',
  templateUrl: './vertical-menu.component.html',
  styleUrls: ['./vertical-menu.component.scss'],
  encapsulation: ViewEncapsulation.None,

})
export class VerticalMenuComponent implements OnInit {

  @Input('groups') groups: Array<Group>
  @Input('referenceId') referenceid:string;
  @Input('expandclass') expandclass:string;
  @Output() sidebarAction : EventEmitter<any> = new EventEmitter<any>();

  subGroups: Array<SubGroup>;
  referenceElm: any;
  constructor(    
    private renderer: Renderer2) {
  }

  

  @HostListener('document:click', ['$event.target'])
  public onClick(target) {
    const clickedInside = this.referenceElm.contains(target);
    if (!clickedInside) {
    this.onCloseSidebar();
    }
  }

  ngOnInit() {
 
  }

  ngAfterViewInit() {
    this.referenceElm = this.renderer.selectRootElement('#'+this.referenceid, true);
  }

  onWidgetMouseAction(is, item) {
    var w: Widget = item;
  }
 

  onOpenSidebar(item) {
      if(this.groups){
          this.groups.forEach(r=>r.isActive=false);
      }
      var gm: Group = item;
      gm.isActive=true;
      this.subGroups = gm.subGroups;
      this.renderer.addClass(this.referenceElm, this.expandclass);
  }

  onCloseSidebar(){
      this.renderer.removeClass(this.referenceElm, this.expandclass);
   }

  onMenuClick(item, event) {
    this.sidebarAction.emit({ click: item, event: event });
    this.onCloseSidebar();
  }
}
