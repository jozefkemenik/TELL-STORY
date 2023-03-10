import { AfterViewInit, Component, ViewChild, OnInit, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { WidgetDirective } from './widget.directive';
import { WidgetFactoryService } from './widget-factory.service';
import { WidgetService } from '../widget.service';
import { IWidgetBase, WidgetContent, WidgetInstance } from '../models/w.model'
import { IWidgetControlBase, WidgetControlContent } from '../models/wc.model'

@Component({
  selector: 'app-widget-factory',
  templateUrl: './widget-factory.component.html',
  styleUrls: ['./widget-factory.component.scss']
})

export class WidgetFactoryComponent implements OnInit, AfterViewInit {

  @Input('widgetControlContent') widgetControlContent?: WidgetControlContent
  @Input('widgetContent') widgetContent?: WidgetContent
  @Output('onWPositionLoad') onWPositionLoad? = new EventEmitter();
  /**
   * widget directive to host real widget components
   * see dynamic components in angular docs.
   */
  @ViewChild(WidgetDirective) widgetHost: WidgetDirective;


  widgetInxtance: WidgetInstance = null;

  constructor(private widgetFactoryService: WidgetFactoryService, private ws: WidgetService) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    if (this.widgetContent) {
      this.widgetFactoryService.load(this.widgetContent.wtuid).then((componentFactory) => {
        // clears old data on host
        let viewContainerRef = this.widgetHost.viewContainerRef;

        viewContainerRef.clear();
        // add new data to host
        let pluginComponent = viewContainerRef.createComponent<IWidgetBase>(componentFactory);
        this.ws.createWInstanceFromWContent(this.widgetContent)
        .then(r => {
          this.onWPositionLoad.emit(r.content)
        });       
        pluginComponent.instance.content = this.widgetContent;       
      });
    } else {
      this.widgetFactoryService.load(this.widgetControlContent.name).then((componentFactory) => {
        // clears old data on host
        let viewContainerRef = this.widgetHost.viewContainerRef;
        viewContainerRef.clear();
        // add new data to host
        let pluginComponent = viewContainerRef.createComponent<IWidgetControlBase>(componentFactory);
        pluginComponent.instance.content = this.widgetControlContent
      })
    }
  }
}
