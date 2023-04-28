import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../catagory.test-samples';

import { CatagoryFormService } from './catagory-form.service';

describe('Catagory Form Service', () => {
  let service: CatagoryFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CatagoryFormService);
  });

  describe('Service methods', () => {
    describe('createCatagoryFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCatagoryFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            catagoryId: expect.any(Object),
            catagoryName: expect.any(Object),
          })
        );
      });

      it('passing ICatagory should create a new form with FormGroup', () => {
        const formGroup = service.createCatagoryFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            catagoryId: expect.any(Object),
            catagoryName: expect.any(Object),
          })
        );
      });
    });

    describe('getCatagory', () => {
      it('should return NewCatagory for default Catagory initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createCatagoryFormGroup(sampleWithNewData);

        const catagory = service.getCatagory(formGroup) as any;

        expect(catagory).toMatchObject(sampleWithNewData);
      });

      it('should return NewCatagory for empty Catagory initial value', () => {
        const formGroup = service.createCatagoryFormGroup();

        const catagory = service.getCatagory(formGroup) as any;

        expect(catagory).toMatchObject({});
      });

      it('should return ICatagory', () => {
        const formGroup = service.createCatagoryFormGroup(sampleWithRequiredData);

        const catagory = service.getCatagory(formGroup) as any;

        expect(catagory).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICatagory should not enable id FormControl', () => {
        const formGroup = service.createCatagoryFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCatagory should disable id FormControl', () => {
        const formGroup = service.createCatagoryFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
