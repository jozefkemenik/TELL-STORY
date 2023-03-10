import { Injectable } from '@angular/core';
import {Group, SubGroup, Widget} from './menu.model';
import { HttpService } from '../../../shared/providers/http.service';
import { Resolve } from '@angular/router';
import { setDOM } from '@angular/platform-browser/src/dom/dom_adapter';

@Injectable({
  providedIn: 'root',
})
export class MenuService implements Resolve<any>{
  public groupMenuItems: Array<Group> = new Array<Group>();
  constructor(private http:HttpService) { }
  resolve() {
      return this.init();
    }

  public init(): Promise<any> {
    this.groupMenuItems = new Array<Group>();
  
        

    return this.http.get('/widget/LoadWidgetTypes', null)
      .then(
        (r) => {
          if (r) {
             var gmi = this.groupMenuItems.concat(r.map(rr=>{
              let res=  rr as Group;
              res["iconFA"]= Group.getIconFA(res.icon);
              res.subGroups.forEach((sg)=>{
                sg["iconFA"]= Group.getIconFA(sg.icon);
                //sg.tkTitle =  Group.getGroupTextByIcon(sg.icon);
              })
              return res;
            })
            );
            this.groupMenuItems = gmi.filter(f=>f.subGroups && f.subGroups.length>0);

          }
        }     
      ,
       //error
        (msg) => {//return this.groupMenuItems; 
        }
      );
  }

   public get GroupsDockingWidgets():Array<Group>{
      return this.groupMenuItems;
   }
}
