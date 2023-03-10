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
        integer = 'integer',
        decimal = 'decimal',
        string = 'string',
        datetime = 'datetime',
    }
}

export namespace DataMappingValue {

    export class Axis {
        name: string;
        columnName: string;
        function: string;
        buckets: Number;
    }
    export class Limit {
        limit: number;
    }

    export class Order {
        "axisName": string;
        "orderingType": string;
    }

    export class Binding {
        selectedDatasets: Array<Dataset>
        dataset: string;
        dimensionAxes: Array<Axis>;
        metricAxes: Array<Axis>;

        order: Order;

        limitOffset: Limit

        toJs(): Object {
 
            var obj;         
            if(Object.keys(this.dimensionAxes[0]).length < 1  && (this.limitOffset=== undefined))
            {
                obj = {
                    binding: {
                        dataset: this.dataset,                        
                        metricAxes: this.metricAxes.map(r => {
                            return {
                                "columnName": r.columnName,
                                "function": r.function,
                                "name": r.name,
                            }
                        }),
                    }
                }
            } 
            else
            {
                obj = {
                    binding: {
                        dataset: this.dataset,
                        dimensionAxes: this.dimensionAxes.map(r => {
                            return {
                                "columnName": r.columnName,
                                "function": r.function,
                                "name": r.name,
                                "bucketsCount": r.buckets
                            }
                        }),
                        
                        metricAxes: this.metricAxes.map(r => {
                            return {
                                "columnName": r.columnName,
                                "function": r.function,
                                "name": r.name,
                            }
                        }),
    
                        limitOffset: {
                            "limit": this.limitOffset ? this.limitOffset.limit : 30
                        }
                    }
                }
    
                if (this.order) {
                    obj.binding["ordering"] = [{
                        "axisName": this.order.axisName,
                        "orderingType": this.order.orderingType
                    }]
                }

                //  if (this.limitOffset && this.limitOffset.limit) {
                //     obj["limitOffset"] = [{
                //         "limit": this.limitOffset
                //     }]
                // }


            }
           


           

            return obj;
        }
    }

    export class TextBiding{
        textContent: string;

        toJs(): Object {
            var obj;  
            obj = {
                "value": this.textContent,                                                                 
            }
            return obj;
        }
    }
}

    export class Dataset {
        datasetId: string;
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
        convertedType: string;
        totalNmb: number;
        totalNmbDesc: string;
        columnTypeName: string;
        datasetId?: string;
        datasetName?: any;
    }

    export class DatasetDetail {
        datasetName?: any;
        datasetUID: string;
        rowsCount: number;
        columnsCount: number;
        createdDate: Date;
        datasetColumns: Array<DatasetColumn>;
    }




