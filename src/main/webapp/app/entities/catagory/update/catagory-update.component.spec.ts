import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CatagoryFormService } from './catagory-form.service';
import { CatagoryService } from '../service/catagory.service';
import { ICatagory } from '../catagory.model';

import { CatagoryUpdateComponent } from './catagory-update.component';

describe('Catagory Management Update Component', () => {
  let comp: CatagoryUpdateComponent;
  let fixture: ComponentFixture<CatagoryUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let catagoryFormService: CatagoryFormService;
  let catagoryService: CatagoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CatagoryUpdateComponent],
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
      .overrideTemplate(CatagoryUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CatagoryUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    catagoryFormService = TestBed.inject(CatagoryFormService);
    catagoryService = TestBed.inject(CatagoryService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const catagory: ICatagory = { id: 456 };

      activatedRoute.data = of({ catagory });
      comp.ngOnInit();

      expect(comp.catagory).toEqual(catagory);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICatagory>>();
      const catagory = { id: 123 };
      jest.spyOn(catagoryFormService, 'getCatagory').mockReturnValue(catagory);
      jest.spyOn(catagoryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ catagory });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: catagory }));
      saveSubject.complete();

      // THEN
      expect(catagoryFormService.getCatagory).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(catagoryService.update).toHaveBeenCalledWith(expect.objectContaining(catagory));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICatagory>>();
      const catagory = { id: 123 };
      jest.spyOn(catagoryFormService, 'getCatagory').mockReturnValue({ id: null });
      jest.spyOn(catagoryService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ catagory: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: catagory }));
      saveSubject.complete();

      // THEN
      expect(catagoryFormService.getCatagory).toHaveBeenCalled();
      expect(catagoryService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICatagory>>();
      const catagory = { id: 123 };
      jest.spyOn(catagoryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ catagory });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(catagoryService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
