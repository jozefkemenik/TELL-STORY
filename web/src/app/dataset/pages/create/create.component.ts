import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dataset-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  private type: number = null;

  ngOnInit(): void {
  }
}
