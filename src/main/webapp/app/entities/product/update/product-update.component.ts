import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ProductFormService, ProductFormGroup } from './product-form.service';
import { IProduct } from '../product.model';
import { ProductService } from '../service/product.service';
import { ITitle } from 'app/entities/title/title.model';
import { TitleService } from 'app/entities/title/service/title.service';
import { IDiscount } from 'app/entities/discount/discount.model';
import { DiscountService } from 'app/entities/discount/service/discount.service';
import { ICatagory } from 'app/entities/catagory/catagory.model';
import { CatagoryService } from 'app/entities/catagory/service/catagory.service';

@Component({
  selector: 'jhi-product-update',
  templateUrl: './product-update.component.html',
})
export class ProductUpdateComponent implements OnInit {
  isSaving = false;
  product: IProduct | null = null;

  titlesSharedCollection: ITitle[] = [];
  discountsSharedCollection: IDiscount[] = [];
  catagoriesSharedCollection: ICatagory[] = [];

  editForm: ProductFormGroup = this.productFormService.createProductFormGroup();

  constructor(
    protected productService: ProductService,
    protected productFormService: ProductFormService,
    protected titleService: TitleService,
    protected discountService: DiscountService,
    protected catagoryService: CatagoryService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareTitle = (o1: ITitle | null, o2: ITitle | null): boolean => this.titleService.compareTitle(o1, o2);

  compareDiscount = (o1: IDiscount | null, o2: IDiscount | null): boolean => this.discountService.compareDiscount(o1, o2);

  compareCatagory = (o1: ICatagory | null, o2: ICatagory | null): boolean => this.catagoryService.compareCatagory(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ product }) => {
      this.product = product;
      if (product) {
        this.updateForm(product);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const product = this.productFormService.getProduct(this.editForm);
    if (product.id !== null) {
      this.subscribeToSaveResponse(this.productService.update(product));
    } else {
      this.subscribeToSaveResponse(this.productService.create(product));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProduct>>): void {
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

  protected updateForm(product: IProduct): void {
    this.product = product;
    this.productFormService.resetForm(this.editForm, product);

    this.titlesSharedCollection = this.titleService.addTitleToCollectionIfMissing<ITitle>(this.titlesSharedCollection, product.title);
    this.discountsSharedCollection = this.discountService.addDiscountToCollectionIfMissing<IDiscount>(
      this.discountsSharedCollection,
      product.discount
    );
    this.catagoriesSharedCollection = this.catagoryService.addCatagoryToCollectionIfMissing<ICatagory>(
      this.catagoriesSharedCollection,
      product.catagory,
      product.catagory
    );
  }

  protected loadRelationshipsOptions(): void {
    this.titleService
      .query()
      .pipe(map((res: HttpResponse<ITitle[]>) => res.body ?? []))
      .pipe(map((titles: ITitle[]) => this.titleService.addTitleToCollectionIfMissing<ITitle>(titles, this.product?.title)))
      .subscribe((titles: ITitle[]) => (this.titlesSharedCollection = titles));

    this.discountService
      .query()
      .pipe(map((res: HttpResponse<IDiscount[]>) => res.body ?? []))
      .pipe(
        map((discounts: IDiscount[]) => this.discountService.addDiscountToCollectionIfMissing<IDiscount>(discounts, this.product?.discount))
      )
      .subscribe((discounts: IDiscount[]) => (this.discountsSharedCollection = discounts));

    this.catagoryService
      .query()
      .pipe(map((res: HttpResponse<ICatagory[]>) => res.body ?? []))
      .pipe(
        map((catagories: ICatagory[]) =>
          this.catagoryService.addCatagoryToCollectionIfMissing<ICatagory>(catagories, this.product?.catagory, this.product?.catagory)
        )
      )
      .subscribe((catagories: ICatagory[]) => (this.catagoriesSharedCollection = catagories));
  }
}
