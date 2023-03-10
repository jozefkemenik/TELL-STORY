import { ViewChild, Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-atoms-card',
  templateUrl: './atoms-card.component.html',
  styleUrls: ['./atoms-card.component.scss']
})


export class AtomsCardComponent implements OnInit {

  @Input() item: string;

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    
  }
}

