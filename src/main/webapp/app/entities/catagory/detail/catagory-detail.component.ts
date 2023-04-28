import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICatagory } from '../catagory.model';

@Component({
  selector: 'jhi-catagory-detail',
  templateUrl: './catagory-detail.component.html',
})
export class CatagoryDetailComponent implements OnInit {
  catagory: ICatagory | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ catagory }) => {
      this.catagory = catagory;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
