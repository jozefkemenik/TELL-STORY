import {
  Component, OnInit, EventEmitter, Output, OnDestroy,
  ViewEncapsulation, ElementRef, Renderer2
} from '@angular/core';
import { WidgetGridService } from './widget-grid.service';
import * as $ from 'jquery';
import 'jquery-ui-dist/jquery-ui';


// import { ConsoleReporter } from 'jasmine';


@Component({
  selector: 'app-widget-grid',
  templateUrl: './widget-grid.component.html',
  styleUrls: ['./widget-grid.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WidgetGridComponent implements OnInit, OnDestroy {
  public selecteId: any = null;
  public timerResize = null;

  private pages = [{id:0}];

  constructor(private widgetGridService: WidgetGridService,
    private renderer: Renderer2) { }


  ngOnInit() {
    initTouch();
  }
  ngOnDestroy() {
    removeTouch();
  }

  private addPage(){
    this.pages.push({id:this.pages[this.pages.length-1].id+1})
  }

  public onWPositionLoad(event) {
    var item = this.items.find(f => f.wContent.wuid == event.wuid);
    var widgetElm = this.renderer.selectRootElement('#' + item.id, true);
    var $dragElm = $(widgetElm);
    var $rotElm = $dragElm.find('.rotateable');
    if (event.configuration && event.configuration.layout && event.configuration.layout.position) {
      this.renderer.setStyle($dragElm[0], 'top', event.configuration.layout.position.top + 'px');
      this.renderer.setStyle($dragElm[0], 'left', event.configuration.layout.position.left + 'px');
      this.renderer.setStyle($rotElm[0], 'width', event.configuration.layout.position.width + 'px');
      this.renderer.setStyle($rotElm[0], 'height', event.configuration.layout.position.height + 'px');
      if(event.configuration.layout.position.rotate){
        this.renderer.setStyle($rotElm[0], '-moz-transform', `rotate(${event.configuration.layout.position.rotate}deg)`);
        this.renderer.setStyle($rotElm[0], '-webkit-transform', `rotate(${event.configuration.layout.position.rotate}deg)`);
      }

      this.widgetGridService.itemResize(widgetElm.id,
        event.configuration.layout.position.top,
        event.configuration.layout.position.left,
        event.configuration.layout.position.width,
        event.configuration.layout.position.height,
        event.configuration.layout.position.rotate);
    }

  }

  createWidgetElm(itemId) {
    this.clickItemGrid(itemId);   
  }

  initDraggable(widgetElm: any) {

    this.renderer.setStyle(widgetElm, 'position', 'absolute');
    var $dragElm = $(widgetElm);
    var $rotElm = $dragElm.find('.rotateable');

    $rotElm.resizable({
      grid: 10, containment: '#canvas-content', handles: 'all',
      stop: (event, ui) => {
        this.widgetGridService.itemResize(widgetElm.id,
          null,
          null,
          ui.size.width,
          ui.size.height,
          null);
      }
    });

    $dragElm.draggable({
      grid: [10, 10],
      snap: true,
      handle: '.drag',
      containment: '#canvas-content',
      start: function (event, ui) {
        //isDraggingMedia = true;
      },
      stop: (event, ui) => {
        this.widgetGridService.itemResize(widgetElm.id,
          ui.position.top,
          ui.position.left,
          null,
          null, 
          null);
      }
    });


    $rotElm.draggable({
      handle: '.rotate',
      opacity: 0.001,
      helper: 'clone',
      drag: (event) => {
        var // get center of div to rotate
          pw = event.target,
          pwBox = pw.getBoundingClientRect(),
          center_x = (pwBox.left + pwBox.right) / 2,
          center_y = (pwBox.top + pwBox.bottom) / 2,
          // get mouse position
          mouse_x = event.pageX,
          mouse_y = event.pageY,
          radians = Math.atan2(mouse_x - center_x, mouse_y - center_y),
          degree = Math.round((radians * (180 / Math.PI) * -1) + 100);

          

        var deg = degree + 170;

        var rotateCSS = 'rotate(' + deg  + 'deg)';
        this.renderer.setStyle(pw, '-moz-transform', rotateCSS);
        this.renderer.setStyle(pw, '-webkit-transform', rotateCSS);

        //save configuration
        clearTimeout(this.timerResize);
        this.timerResize = setTimeout(()=>{
        this.widgetGridService.itemResize(widgetElm.id,
          null,
          null,
          null,
          null, 
          deg);
        },500)
       
      }
    });
    //todo - wrong implementation
    $('.zindex', $dragElm).on('click', function () {
      if ($(this).hasClass('zindex-up')) {
        if ($(this).parent()[0].style.zIndex != '') {
          $(this).parent()[0].style.zIndex = parseInt($(this).parent()[0].style.zIndex) + 1;
        }
        else {
          $(this).parent()[0].style.zIndex = 10;
        }
      }
      else if ($(this).hasClass('zindex-down')) {
        if ($(this).parent()[0].style.zIndex != '') {
          if (parseInt($(this).parent()[0].style.zIndex) > 1) {
            $(this).parent()[0].style.zIndex = parseInt($(this).parent()[0].style.zIndex) - 1;
          }
        }
        else {
          $(this).parent()[0].style.zIndex = 10;
        }
      }
    });
  }

  public deleteItem(id: string): void {
    const item = this.items.find(d => d.id === id);
    item.wContent.isLoading = true;
    this.widgetGridService.deleteItem(item.wContent.wuid).then(()=>{
      this.selecteId=null;
      var widgetElm = this.renderer.selectRootElement('#' + id, true);
      if (widgetElm) {
        this.removeDragable(widgetElm);
      }
      item.isActive=false;
      this.items.splice(this.items.indexOf(item), 1);
    }).finally(()=>{
      item.wContent.isLoading = false;
    })
  
   
  }

  removeDragable(widgetElm: any){
    var $dragElm = $(widgetElm);
    var $rotElm = $dragElm.find('.rotateable');
    $rotElm.resizable("destroy");
    $dragElm.draggable( "destroy");
    $rotElm.draggable( "destroy");
  }

  get items(): Array<any> {
    return this.widgetGridService.gridItems;
  }

  public clickItemGrid(id) {
    if(id!=this.selecteId){
      this.selecteId = id;
      this.items.forEach(r => 
        {
        if (r.isActive) {
          r.isActive = false;
          var widgetElm = this.renderer.selectRootElement('#' + r.id, true);
          if (widgetElm) {
            this.removeDragable(widgetElm);
          }
        }
        if (r.id == id) {
         
          r.isActive = true;
          var widgetElm = this.renderer.selectRootElement('#' + r.id, true);
          if (widgetElm) {
            this.initDraggable(widgetElm);
          }
        }
        });
        
      }
  }
}


function initTouch() {
  document.addEventListener("touchstart", touchHandler, true);
  document.addEventListener("touchmove", touchHandler, true);
  document.addEventListener("touchend", touchHandler, true);
  document.addEventListener("touchcancel", touchHandler, true);
}

function removeTouch() {
  document.removeEventListener("touchstart", touchHandler, true);
  document.removeEventListener("touchmove", touchHandler, true);
  document.removeEventListener("touchend", touchHandler, true);
  document.removeEventListener("touchcancel", touchHandler, true);
}

function touchHandler(event) {
  var touch = event.changedTouches[0];
  var simulatedEvent = document.createEvent("MouseEvent");
  simulatedEvent.initMouseEvent({
    touchstart: "mousedown",
    touchmove: "mousemove",
    touchend: "mouseup"
  }[event.type], true, true, window, 1,
    touch.screenX, touch.screenY,
    touch.clientX, touch.clientY, false,
    false, false, false, 0, null);

  touch.target.dispatchEvent(simulatedEvent);
  //event.preventDefault();
}