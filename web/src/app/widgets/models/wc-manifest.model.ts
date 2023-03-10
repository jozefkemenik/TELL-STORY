
export class WidgetControlManifest {
    order: number;
    name: string;
    label: string;
    placeholder: string;
    description: string;
    value: any;

    subjName: string;

    minValue: number;
    maxValue: number;
    precision: number;
    scale: number;
    step: number;

    type: EWidgetControlType;

    displayXAxisControl: boolean;
    displayYAxisControl: boolean;

    displayPreffixSuffix: boolean;

    displayInputText:boolean;
 
    maxLimit: number;
    maxBucket: number;
    displaySortOptions: boolean;
    allowedColumTypes: Array<string>;
}

export enum EWidgetControlType {
    data = "data",
    style = "style"
}