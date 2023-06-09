import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { DiscountFormService, DiscountFormGroup } from './discount-form.service';
import { IDiscount } from '../discount.model';
import { DiscountService } from '../service/discount.service';

@Component({
  selector: 'jhi-discount-update',
  templateUrl: './discount-update.component.html',
})
export class DiscountUpdateComponent implements OnInit {
  isSaving = false;
  discount: IDiscount | null = null;

  editForm: DiscountFormGroup = this.discountFormService.createDiscountFormGroup();

  constructor(
    protected discountService: DiscountService,
    protected discountFormService: DiscountFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ discount }) => {
      this.discount = discount;
      if (discount) {
        this.updateForm(discount);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const discount = this.discountFormService.getDiscount(this.editForm);
    if (discount.id !== null) {
      this.subscribeToSaveResponse(this.discountService.update(discount));
    } else {
      this.subscribeToSaveResponse(this.discountService.create(discount));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDiscount>>): void {
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

  protected updateForm(discount: IDiscount): void {
    this.discount = discount;
    this.discountFormService.resetForm(this.editForm, discount);
  }
}
