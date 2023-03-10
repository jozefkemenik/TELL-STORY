

export enum EWidgetType {
    dockingWidget = 'dockingWidget'
}
export class Widget {
    id: number;
    wtuid: string;
    tkTitle: string;
    tkDesc: string;
}

export class SubGroup {
    icon: string;
    tkTitle: string;
    tkDesc: string;
    widgets: Widget[];
}
export class Group {
    icon: string;
    isActive:boolean;
    static getGroupTextByIcon(icon):string {
        switch (icon) {     
            // case 'chart_column':
            //     return 't_widget_column_chart';
            // case 'chart_line':
            //     return 't_widget_line_chart';
            // case 'chart_pie':
            //     return 't_widget_pie_chart';
             default:
                return icon;
        }
      
    }
    //for temporary purpose
    static getIconFA(icon):string {
        switch (icon) {
            case 'chart':
                return 'fad fa-chart-pie-alt';
            case 'chart_usecases':
                return 'fad fa-analytics';
            case 'chart_column':
                return 'fad fa-chart-bar';
            case 'chart_line':
                return 'fad fa-chart-line';
            case 'chart_pie':
                return 'fad fa-chart-pie';
            case 'custom':
                return 'fad fa-question';
            case 'text':
                 return 'fad fa-text';
            case 'text_heading':
                 return 'fad fa-heading';
            case 'text_paragraph':
                return 'fad fa-paragraph';
                 
            default:
                return icon;
        }
      
    }
    tkTitle: string;
    tkDesc: string;
    subGroups: SubGroup[];
    
}


export class VerticaMenuItem {
    //api mapping
    public id: number;
    public wtuid: string;
    public widgetGroup: string;
    public widgetSubGroup: string;
    public type: string;
    public tkLabel: string;
    public tkTooltip: string;
    public icon: string;
    // app usage
    public href: string;
    public options: any;
}


export class DataSetItem {
    public datasetName: string;
    public datasetUID: string;
    public rowCount: number;
    public columnCount: number;
    public createdDate: Date;
}


export class DataSetColumnItem {
    public Id: number;
    public columnName: string;
    public columnType: string;
}







