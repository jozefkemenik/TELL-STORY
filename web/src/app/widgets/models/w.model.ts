import { BehaviorSubject, Subject, } from 'rxjs';
import { ESignalEventType, ISignalEvent } from './enum-signal.model';


//result from load data api
export class DataLoad {
    [name: string]: any;
}

export interface ISignalEvent {
    type: ESignalEventType,
    object: any;
    name: string;
    resolve(value?: any): void,
    reject(value?: any): void
}

export interface IFactoryWidgetBase {
    wuid: string;
    title: string;
    [propertyName: string]: any;
}

export interface IWidgetBase {
    /**
     * represents content of a widget
     */
    content: WidgetContent;
}

export class WidgetContent implements IFactoryWidgetBase {

    top: number = 0;
    left: number = 0;
    width: number = 380;
    height: number = 380;
    rotate: number = 0;
    parentId?: number;

    configuration = {
        data: {},
        layout: {
            position: {}
        }
    };

    wuid: string;
    title: string;
    wtuid: string;
    isLoading: boolean;
    isValid: boolean = true;
    //direction: from core to widget 
    private toWEventSubject: Subject<ISignalEvent> = new Subject<ISignalEvent>();
    //direction: from widget to core
    private fromWEventSubject: Subject<ISignalEvent> = new Subject<ISignalEvent>();

    subscribeSignalFromWPromise(fn: (ISignalEvent) => void) {
        this.fromWEventSubject.subscribe((e) => fn(e));
    }
    sendSignalFromWPromise(type: ESignalEventType, obj: any): Promise<any> {
        return new Promise<any>((resolve, reject) => this.fromWEventSubject.next(
            {
                resolve: resolve,
                reject: reject,
                type: type,
                name: this.wtuid,
                object: obj
            } as ISignalEvent
        ));
    }

    subscribeSignalToWPromise(fn: (ISignalEvent) => void) {
        this.toWEventSubject.subscribe((e) => fn(e));
    }

    sendSignalToWPromise(type: ESignalEventType, obj: any, name: string = null): Promise<any> {
        return new Promise<any>((resolve, reject) => this.toWEventSubject.next(
            {
                resolve: resolve,
                reject: reject,
                type: type,
                name: name,
                object: obj
            } as ISignalEvent
        ));
    }
}

export class WidgetInstance {
    get wuid(): string { return this.content.wuid; }

    content: WidgetContent;
}









