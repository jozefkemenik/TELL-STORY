import { Injectable } from '@angular/core';
import { HttpService } from '../shared/providers/http.service';
import { DataLoad } from './models/api-result.model';
import { WidgetContent, WidgetInstance } from './models/w.model';
import { WidgetControlContent } from './models/wc.model';
import { ISignalEvent, ESignalEventType } from './models/enum-signal.model';
import { WidgetControlManifest } from './models/wc-manifest.model';
import { WidgetManifest } from './models/w-manifest.model';

@Injectable({
  providedIn: 'root'
})
export class WidgetService {

  public storyId:any;
  public parentWidgetId:any;
  public datasets:Array<any> = [{"datasetId":235,"datasetName":"first dataset","datasetUID":"1a260646-039f-433a-b8ef-95567555a3a9","rowsCount":0,"columnsCount":0,"createdDate":"0001-01-01T00:00:00"},{"datasetId":12449,"datasetName":"Taxi Rides 1 billion","datasetUID":"trips","rowsCount":1201024116,"columnsCount":7,"createdDate":"2019-07-11T12:22:34.966596"},{"datasetId":403,"datasetName":"Sample Telco","datasetUID":"81c6b169-4f8f-4b8b-ae42-3ce550ef5b68","rowsCount":10000,"columnsCount":7,"createdDate":"2019-07-12T16:26:08.382643"}];

  constructor(private http: HttpService) { }

  private loadData(wuid: string): Promise<DataLoad> {
    return this.http.get('/widget/loaddata', { "wuid": wuid }).then(r => {
      return r as DataLoad;
    });
  }

  private registerWidgetType(wuid: string): Promise<DataLoad> {
    return this.http.post('/widget/RegisterWidgetType', { "wuid": wuid }).then(r => {
      return r as DataLoad;
    });
  }

  private createWidget(wtuid: string, parentId:number): Promise<string> {
    return this.http.post('/widget/CreateWidget', { "wtuid": wtuid ,'parentId':parentId}).then(
      (r) => {
        if (r && r.wuid) {
          return r.wuid;
        }
        return null;
      });
  }

  private saveConfiguration(wuid: string, conf): Promise<boolean> {
    return this.http.post('/widget/saveConfiguration', {
      wuid: wuid,
      parameters: {
        data: conf.data,
        layout: conf.layout
      }
    }).then(r => {
      return r && r.succeeded;
    });
  }

  private loadConfiguration(wuid: string): Promise<any> {
    return this.http.get('/widget/loadConfiguration', { wuid: wuid })
  }


  //stories
  public createStory(name, datasets?:Array<any>): Promise<any> {
  
    this.datasets=datasets;
    
    return this.http.post('/story/createStory', {
      "name": name,
      "layoutConfiguration": {
        "position": {
          "left": 0,
          "top": 0
        },
        "style": {
          "color": "white"
        }
      }
      ,"datasets":datasets
    }).then((r)=>{
      if(r && r.id){
        this.storyId=r.id;
        this.parentWidgetId = r.rootwidget.Id;
      }
      return r;
    })
  }

  public loadStory(id): Promise<any> {
    this.storyId = id;
    return this.http.get('/story/loadStory', { "id": id }).then(r => {
 
      if(r.datasets){
        this.datasets=r.datasets;
      }
      this.parentWidgetId =r.rootwidget.Id;
      return r;
    });
  }


  public deleteWidget(wuid): Promise<any>{
    return this.http.post('/widget/deleteWidget',{wuid});
  }


 






  public addWidget(wtuid: string, wuid=null): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.http.getFileFromAssets('widgets/' + wtuid + '/manifest.json').
        then(
          (res) => {
            var manifest = res as WidgetManifest;
            if (!manifest) {
              throw "//todo"
            }
            //create result
            var wContent = this.convertWManifestToContent(manifest);
            wContent.wuid=wuid;
            var result = {
              wContent: wContent,
              wControlsMan: manifest.widgetControls,
            }
            resolve(result);
          }
        )
    });
  }

setDatasetDefault(conf:any){

    if (conf && conf.parameters
      && conf.parameters.data
      && conf.parameters.layout) {
        conf.parameter.layout.selectedDatasets = this.datasets
       // conf.parameters.data.binding.dataset = this.datasets && this.datasets.length>0? this.datasets[this.datasets.length-1].datasetUID:"";  
    }
    return conf;
}


  createWInstanceFromWContent(wContent: WidgetContent): Promise<WidgetInstance> {
    return new Promise<any>((resolve, reject) => {
      var wi = new WidgetInstance();
      wi.content = wContent;
      if (wContent.wuid!=undefined || wContent.wuid!=null) {
        this.loadConfiguration(wContent.wuid).
          then((conf) => {
            wContent.configuration=conf.parameters;
            wContent.sendSignalToWPromise(ESignalEventType.LoadConfiguration, conf).then(
              (resolve) => { 
                
              },
              (msg) => { }
            );
          }
          ).finally(() => {
            resolve(wi);
          });
      }
      else {
        this.createWidget(wContent.wtuid, wContent.parentId ).then(
          (wuid) => {
           // this.saveToLocaleStorate(wContent.wtuid,wuid);
            wContent.wuid = wuid;
            this.loadConfiguration(wContent.wuid).
              then((conf) => {
               // conf = this.setDatasetDefault(conf);

                wContent.sendSignalToWPromise(ESignalEventType.LoadConfiguration, conf).then(
                  (resolve) => { },
                  (msg) => { }
                );
              }
              ).finally(() => {
                resolve(wi);
              });
          }
        )}
    });
  }

  convertWManifestToContent(man: WidgetManifest): WidgetContent {
    let wContent = new WidgetContent();
    wContent.wtuid = man.name;
    wContent.parentId=this.parentWidgetId;


    wContent.subscribeSignalToWPromise((event) =>{
      if (event.type == ESignalEventType.LayoutDesign && event.name == "position") {    
          wContent.configuration.layout.position = {
            width: wContent.width,
            height: wContent.height,
            top: wContent.top,
            left: wContent.left,
            rotate:wContent.rotate,
          };
          if(wContent.wuid){
            this.saveConfiguration(wContent.wuid, wContent.configuration);
          }
          event.resolve();
      }
    });

    wContent.subscribeSignalFromWPromise((event) => {
      //Load data
      if (event.type == ESignalEventType.LoadData) {
        this.loadData(wContent.wuid).then(
          (result) => {
            event.resolve(result)
          },
          (msg) => {
            event.reject(msg);
          });
      }
      //Save Configuration
      if (event.type == ESignalEventType.SaveConfiguration) {
        Object.assign(wContent.configuration.data,event.object.data);
        Object.assign(wContent.configuration.layout,event.object.layout);
        this.saveConfiguration(wContent.wuid, wContent.configuration)
          .then((result) => { event.resolve(result) },
            (msg) => { event.reject(msg)});
      }
    });

    return wContent;
  }

  convertWCManifestToContent(man: WidgetControlManifest, wContent: WidgetContent): WidgetControlContent {
    let wcc = new WidgetControlContent();
    Object.assign(wcc, man);
    
    //map datasets 
    wcc.datasets =  this.datasets;

    //subscribe event from W to WC
    wContent.subscribeSignalFromWPromise((event) => {

      wcc.sendSignalToWcPromise(event.type, event.object).then(event.resolve, event.reject);

    });

    wContent.subscribeSignalToWPromise((event) => {
      if (event.type == ESignalEventType.LoadConfiguration) {
        wcc.sendSignalToWcPromise(ESignalEventType.LoadConfiguration, event.object).then(
          (result) => { },
          (msg) => { }
        );
      }
    });

    //subscribe event from WC to W
    wcc.subscribeSignalFromWcPromise((event) => {
      if (event.type == ESignalEventType.ValueChanged && event.name == "title") {
        wContent.title = event.object as string;
        event.resolve();
      }
      else {
        wContent.sendSignalToWPromise(event.type, event.object, event.name).then(event.resolve, event.reject);
      }
    });
    return wcc;
  }

 



}
