export namespace DataMappingRule {
    export enum EFunctions {
        AllValues = 'AllValues',
        DistinctValues = 'DistinctValues',
        Count = 'Count',
        Sum = 'Sum',
        Min = 'Min',
        Max = 'Max',
        Avg = 'Avg',
        BUCKETS_COMBO = 'BUCKET_SLIDER',
        BUCKETS_DATETIME = 'BUCKET_DATETIME'
    }

    export enum EColumnType {
        integer='integer', 
        decimal='decimal', 
        string='string', 
        datetime='datetime', 
    }

    export class ColMapping {
        constructor(public Col: Array<EColumnType>,
            public Fun: Array<EFunctions>,
      ) { }
    }
}

    export namespace DataMappingValue {
       
        export class Axis {
            name: string;
            columnName: string;
            function: string;
        }
        export class Binding {
            dataset: string;
            xAxis: Axis;
            yAxis: Axis;
            dimensionAxes: Array<Axis>;
            metricAxes: Array<Axis>;

            toJs():Object{
                return {
                    binding:{
                        dataset: this.dataset,
                        xAxis: {
                            'columnName':this.xAxis.columnName,
                            'function':this.xAxis.function,
                            'name':this.xAxis.name,
                        },
                        yAxis: {
                            'columnName':this.yAxis.columnName,
                            'function':this.yAxis.function,
                            'name':this.yAxis.name,
                        }
                        ,
                        
                    }
                }
            }

            toNewJs(): Object {
                return {
                    binding: {
                        dataset: this.dataset,
                        //dimensionAxes: this.dimensionAxes,
                        metricAxes: this.metricAxes
                    }
                }
            }
        }
        
    }

    export class Dataset {
        datasetId:string;
        datasetName?: any;
        datasetUID: string;
        rowsCount: number;
        columnsCount: number;
        createdDate: Date;
    }
    
    export class DatasetColumn {
        id: number;
        columnName: string;
        columnType: string;
        convertedType:string;
        totalNmb:number;
        totalNmbDesc:string;
        columnTypeName:string;
    }
    
    export class  DatasetDetail {
        datasetName?: any;
        datasetUID: string;
        rowsCount: number;
        columnsCount: number;
        createdDate: Date;
        datasetColumns: Array<DatasetColumn>;
    }




