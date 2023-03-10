import { Component, OnInit, ViewEncapsulation, ViewChild, Inject, EventEmitter,Output  } from '@angular/core';
import { MenuService } from '../menu/menu.service';
import {WidgetGridService} from '../../../widgets/widget-grid/widget-grid.service';
import { timeout } from 'rxjs/operators';
import  {WidgetControlManifest} from '../../../widgets/models/wc-manifest.model'
import  {WidgetContent} from '../../../widgets/models/w.model'


@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  //encapsulation: ViewEncapsulation.None,
})

export class SidenavComponent implements OnInit {
  @Output() sidebarAction:EventEmitter<any> = new EventEmitter<any>();
  constructor(
    private wgs: WidgetGridService,
    public menuService: MenuService) {
  }

  ngOnInit() {
  }

  onSidebarAction(event):void{    
    if(event.click){
      this.wgs.addNewWidget(event.click.wtuid);
    }
   }
}


