import { Component, OnInit, Input, ViewEncapsulation, ViewChild } from '@angular/core';
import { WidgetControlContent } from '../models/wc.model';
import { WidgetContent } from '../models/w.model';
import { WidgetControlManifest, EWidgetControlType } from '../models/wc-manifest.model'
import { WidgetService } from '../widget.service';
import { TabsetComponent } from 'ngx-bootstrap';


@Component({
  selector: 'app-widget-settings',
  templateUrl: './widget-settings.component.html',
  styleUrls: ['./widget-settings.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class WidgetSettingsComponent implements OnInit {
  public wccsStyle: Array<WidgetControlContent> = [];
  public wccsData: Array<WidgetControlContent> = [];
  @Input('wContent') wcontent?: WidgetContent;
  @Input('wcManifests')


  set wcManifests(wcmans: Array<WidgetControlManifest>) {
    this.wccsData = wcmans.filter(r => r.type == EWidgetControlType.data).map(r => {
      return this.ws.convertWCManifestToContent(r, this.wcontent);
    })
    this.wccsStyle = wcmans.filter(r => r.type == EWidgetControlType.style).map(r => {
      return this.ws.convertWCManifestToContent(r, this.wcontent);
    })
  }

  constructor(private ws: WidgetService) { }
  ngOnInit() {

  }
}
