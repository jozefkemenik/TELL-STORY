import { Testability } from '@angular/core';

export enum ESignalEventType {
    DataMapping='DataMapping',
    LayoutDesign='LayoutDesign',
    GetConfiguration='GetConfiguration',
    SaveConfiguration='SaveConfiguration',
    LoadData='LoadData',
    WCInit='WCInit', 
    ValueChanged='ValueChanged',
    WReady='WReady',
    LoadConfiguration='LoadConfiguration',
    Test='Test',

    ChangeTextWtoWC ="ChangeTextWtoWC",

    ChangePreffix = "ChangePreffix",
    ChangeSuffix = "ChangeSuffix",


}

export interface ISignalEvent {
    //signal type to recognize action type
    type:ESignalEventType,
    //passign data
    object:any,
    // explicite name for custom purpose / subject name from WC
    name?:string
    resolve(value?: any):void,
    reject(value?: any):void
}