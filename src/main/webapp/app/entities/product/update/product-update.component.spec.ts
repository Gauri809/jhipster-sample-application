import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ProductFormService } from './product-form.service';
import { ProductService } from '../service/product.service';
import { IProduct } from '../product.model';
import { ITitle } from 'app/entities/title/title.model';
import { TitleService } from 'app/entities/title/service/title.service';
import { IDiscount } from 'app/entities/discount/discount.model';
import { DiscountService } from 'app/entities/discount/service/discount.service';
import { ICatagory } from 'app/entities/catagory/catagory.model';
import { CatagoryService } from 'app/entities/catagory/service/catagory.service';

import { ProductUpdateComponent } from './product-update.component';

describe('Product Management Update Component', () => {
  let comp: ProductUpdateComponent;
  let fixture: ComponentFixture<ProductUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let productFormService: ProductFormService;
  let productService: ProductService;
  let titleService: TitleService;
  let discountService: DiscountService;
  let catagoryService: CatagoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ProductUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(ProductUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProductUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    productFormService = TestBed.inject(ProductFormService);
    productService = TestBed.inject(ProductService);
    titleService = TestBed.inject(TitleService);
    discountService = TestBed.inject(DiscountService);
    catagoryService = TestBed.inject(CatagoryService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Title query and add missing value', () => {
      const product: IProduct = { id: 456 };
      const title: ITitle = { id: 96918 };
      product.title = title;

      const titleCollection: ITitle[] = [{ id: 31820 }];
      jest.spyOn(titleService, 'query').mockReturnValue(of(new HttpResponse({ body: titleCollection })));
      const additionalTitles = [title];
      const expectedCollection: ITitle[] = [...additionalTitles, ...titleCollection];
      jest.spyOn(titleService, 'addTitleToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ product });
      comp.ngOnInit();

      expect(titleService.query).toHaveBeenCalled();
      expect(titleService.addTitleToCollectionIfMissing).toHaveBeenCalledWith(
        titleCollection,
        ...additionalTitles.map(expect.objectContaining)
      );
      expect(comp.titlesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Discount query and add missing value', () => {
      const product: IProduct = { id: 456 };
      const discount: IDiscount = { id: 31734 };
      product.discount = discount;

      const discountCollection: IDiscount[] = [{ id: 86588 }];
      jest.spyOn(discountService, 'query').mockReturnValue(of(new HttpResponse({ body: discountCollection })));
      const additionalDiscounts = [discount];
      const expectedCollection: IDiscount[] = [...additionalDiscounts, ...discountCollection];
      jest.spyOn(discountService, 'addDiscountToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ product });
      comp.ngOnInit();

      expect(discountService.query).toHaveBeenCalled();
      expect(discountService.addDiscountToCollectionIfMissing).toHaveBeenCalledWith(
        discountCollection,
        ...additionalDiscounts.map(expect.objectContaining)
      );
      expect(comp.discountsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Catagory query and add missing value', () => {
      const product: IProduct = { id: 456 };
      const catagory: ICatagory = { id: 99511 };
      product.catagory = catagory;
      const catagory: ICatagory = { id: 79928 };
      product.catagory = catagory;

      const catagoryCollection: ICatagory[] = [{ id: 41380 }];
      jest.spyOn(catagoryService, 'query').mockReturnValue(of(new HttpResponse({ body: catagoryCollection })));
      const additionalCatagories = [catagory, catagory];
      const expectedCollection: ICatagory[] = [...additionalCatagories, ...catagoryCollection];
      jest.spyOn(catagoryService, 'addCatagoryToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ product });
      comp.ngOnInit();

      expect(catagoryService.query).toHaveBeenCalled();
      expect(catagoryService.addCatagoryToCollectionIfMissing).toHaveBeenCalledWith(
        catagoryCollection,
        ...additionalCatagories.map(expect.objectContaining)
      );
      expect(comp.catagoriesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const product: IProduct = { id: 456 };
      const title: ITitle = { id: 4805 };
      product.title = title;
      const discount: IDiscount = { id: 12455 };
      product.discount = discount;
      const catagory: ICatagory = { id: 45600 };
      product.catagory = catagory;
      const catagory: ICatagory = { id: 89917 };
      product.catagory = catagory;

      activatedRoute.data = of({ product });
      comp.ngOnInit();

      expect(comp.titlesSharedCollection).toContain(title);
      expect(comp.discountsSharedCollection).toContain(discount);
      expect(comp.catagoriesSharedCollection).toContain(catagory);
      expect(comp.catagoriesSharedCollection).toContain(catagory);
      expect(comp.product).toEqual(product);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProduct>>();
      const product = { id: 123 };
      jest.spyOn(productFormService, 'getProduct').mockReturnValue(product);
      jest.spyOn(productService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ product });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: product }));
      saveSubject.complete();

      // THEN
      expect(productFormService.getProduct).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(productService.update).toHaveBeenCalledWith(expect.objectContaining(product));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProduct>>();
      const product = { id: 123 };
      jest.spyOn(productFormService, 'getProduct').mockReturnValue({ id: null });
      jest.spyOn(productService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ product: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: product }));
      saveSubject.complete();

      // THEN
      expect(productFormService.getProduct).toHaveBeenCalled();
      expect(productService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProduct>>();
      const product = { id: 123 };
      jest.spyOn(productService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ product });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(productService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareTitle', () => {
      it('Should forward to titleService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(titleService, 'compareTitle');
        comp.compareTitle(entity, entity2);
        expect(titleService.compareTitle).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareDiscount', () => {
      it('Should forward to discountService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(discountService, 'compareDiscount');
        comp.compareDiscount(entity, entity2);
        expect(discountService.compareDiscount).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareCatagory', () => {
      it('Should forward to catagoryService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(catagoryService, 'compareCatagory');
        comp.compareCatagory(entity, entity2);
        expect(catagoryService.compareCatagory).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
