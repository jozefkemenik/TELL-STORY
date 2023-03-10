import { Injectable } from '@angular/core';
import { WidgetService } from '../widget.service'
import { WidgetContent } from '../models/w.model';
import { ISignalEvent, ESignalEventType } from '../models/enum-signal.model';
import { WidgetManifest } from '../models/w-manifest.model'
import { WidgetControlManifest } from '../models/wc-manifest.model'



@Injectable({
  providedIn: 'root'
})
export class WidgetGridService {

  constructor(private ws: WidgetService) { }

  public itemResize(id, t, l, w, h, rotate) {
    var item = this.gridItems.find(f=>f.id==id);
    if(w){
      item.wContent.width = w;
    }
    if(h){
      item.wContent.height = h;
    }
    if(t!=null){
      item.wContent.top = t;
    }
    if(l!=null){
      item.wContent.left = l;
    }
    if(rotate!=null){
      item.wContent.rotate = rotate;
    }
   
    this.sendResizeSignal(item.wContent);
  }

  public gridItems: Array<any> = [];

  public clear(){
    this.gridItems=[];
  }


  public addNewWidget(wtuid: string, wuid=null): void {
    this.ws.addWidget(wtuid, wuid).then(
      (res) => {
        if (res) {
          var wContent = res.wContent as WidgetContent;
          //handle signal from W - when is ready to send  back the width / height 
          wContent.subscribeSignalFromWPromise((event) => {
            if (event.type == ESignalEventType.WReady) {
              // this.sendResizeSignal(wContent);
              event.resolve('W ready is done');
            }
          });

          this.gridItems.push({
            id: 'wid-' + (this.gridItems.length == 0 ? 0 : Number(this.gridItems[this.gridItems.length-1].id.split('-')[1]) + 1),
            x: 0, y: 0, cols: 3, rows: 3,
            wContent: wContent,
            wcManifests: res.wControlsMan as Array<WidgetControlManifest>,
            isActive: false
          });
        }
      },
      (msg) => {
        //todo throw exception
      }
    )
  }


  public  createNewStory(name:string, datasets:Array<any>):Promise<any>{
      this.gridItems=[];
      return this.ws.createStory(name, datasets).then((r)=>{
    });
  }

  public showStory(id:string):Promise<any>{
    this.gridItems=[];
    return this.ws.loadStory(id).then((r)=>{
      if(r && r.rootwidget && r.rootwidget.widgets){
        r.rootwidget.widgets.forEach(item => {
          this.addNewWidget(item.wtuid, item.Id);
        });
      }
      return r;
    });
  

    // var str = localStorage.getItem('stories');
    // var arr = JSON.parse(str);
    // var story = arr.find(r=>r.id==value);
    // if (story){
    //   story.children.forEach(item => {
    //     this.addNewWidget(item.wtuid,item.wuid);
    //   });
    // }

  }




  public deleteItem(wuid): Promise<any> {
    return this.ws.deleteWidget(wuid)
  }



  // this._selectedItemPosition has to be populated before sending signal to W
  private sendResizeSignal(wContent: WidgetContent) {
    
    //the coordinates are parts of wContent
    wContent.sendSignalToWPromise(ESignalEventType.LayoutDesign, null, "position")
      .then(r => {
        console.log(ESignalEventType.LayoutDesign, ' done with a result:', r)
      });
  }

  private calcWidthCol() {
    return (window.innerWidth - (80 + 380 + 60)) / 12
  }




}
