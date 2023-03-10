import { BehaviorSubject, Subject } from 'rxjs';
import {WidgetControlManifest} from './wc-manifest.model';
import {ESignalEventType, ISignalEvent} from './enum-signal.model';

export interface IFactoryWidgetControlBase {
    id: number;
    title: string;
    [propertyName: string]: any;
}

export interface IWidgetControlBase{
    /**
     * represents content of a widget
     */
    content: WidgetControlContent;
}

export class WidgetControlContent extends WidgetControlManifest implements IFactoryWidgetControlBase {    
    id: number;
    title: string;
    datasets:Array<any>;
    
    private fromWcEventSubject: Subject<ISignalEvent> = new Subject<ISignalEvent>();
    private toWcEventSubject: Subject<ISignalEvent > = new Subject<ISignalEvent >();  

    subscribeSignalFromWcPromise(fn:(ISignalEvent)=>void){
        this.fromWcEventSubject.subscribe((e)=>
        fn(e));
    }
    sendSignalFromWcPromise(type: ESignalEventType, obj: any): Promise<any> {
        return new Promise<any>((resolve, reject) => this.fromWcEventSubject.next(
            {   resolve:resolve,
                reject:reject,
                type: type,
                name:this.subjName,
                object: obj
            } as ISignalEvent
        ));
    }
    
    subscribeSignalToWcPromise(fn:(ISignalEvent)=>void){
        this.toWcEventSubject.subscribe((e)=>fn(e));
    }
    sendSignalToWcPromise(type: ESignalEventType, obj: any, name:string=null): Promise<any> {
        return new Promise<any>((resolve, reject) => this.toWcEventSubject.next(
            {   resolve:resolve,
                reject:reject,
                type: type,
                name:name,
                object: obj
            } as ISignalEvent
        ));
    }
}

export class WidgetControlInstance {
    content: WidgetControlContent;  
}
   












