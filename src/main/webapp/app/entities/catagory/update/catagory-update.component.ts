import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { CatagoryFormService, CatagoryFormGroup } from './catagory-form.service';
import { ICatagory } from '../catagory.model';
import { CatagoryService } from '../service/catagory.service';

@Component({
  selector: 'jhi-catagory-update',
  templateUrl: './catagory-update.component.html',
})
export class CatagoryUpdateComponent implements OnInit {
  isSaving = false;
  catagory: ICatagory | null = null;

  editForm: CatagoryFormGroup = this.catagoryFormService.createCatagoryFormGroup();

  constructor(
    protected catagoryService: CatagoryService,
    protected catagoryFormService: CatagoryFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ catagory }) => {
      this.catagory = catagory;
      if (catagory) {
        this.updateForm(catagory);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const catagory = this.catagoryFormService.getCatagory(this.editForm);
    if (catagory.id !== null) {
      this.subscribeToSaveResponse(this.catagoryService.update(catagory));
    } else {
      this.subscribeToSaveResponse(this.catagoryService.create(catagory));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICatagory>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(catagory: ICatagory): void {
    this.catagory = catagory;
    this.catagoryFormService.resetForm(this.editForm, catagory);
  }
}
