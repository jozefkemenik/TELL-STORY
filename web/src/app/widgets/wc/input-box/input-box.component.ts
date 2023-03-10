import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef} from '@angular/core';
import { WidgetControlContent} from '../../models/wc.model';
import { ESignalEventType} from '../../models/enum-signal.model';
import { FormControl, FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-input-box',
  templateUrl: './input-box.component.html',
  styleUrls: ['./input-box.component.scss']
})
export class WCInputBoxComponent implements OnInit {
  inputValue = new FormControl();
  
  options: FormGroup;
  content:WidgetControlContent


  @Output() 
  valueChange: EventEmitter<any> = new EventEmitter<any>();
  isLoading = false;
  constructor(fb: FormBuilder) {
    this.options = fb.group({
      hideRequired: false,
    });
  }

  ngOnInit() {
   this.isLoading=true;
   this.inputValue.setValue(this.content.value);
  }

  ngAfterViewInit() {
    this.change();
  }


  change(){
    this.isLoading=true;
    this.content.sendSignalFromWcPromise(ESignalEventType.Test,this.inputValue.value).then(r=>{
      this.isLoading=false;
    });
  }

}