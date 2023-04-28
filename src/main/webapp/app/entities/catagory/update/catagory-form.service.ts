import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ICatagory, NewCatagory } from '../catagory.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICatagory for edit and NewCatagoryFormGroupInput for create.
 */
type CatagoryFormGroupInput = ICatagory | PartialWithRequiredKeyOf<NewCatagory>;

type CatagoryFormDefaults = Pick<NewCatagory, 'id'>;

type CatagoryFormGroupContent = {
  id: FormControl<ICatagory['id'] | NewCatagory['id']>;
  catagoryId: FormControl<ICatagory['catagoryId']>;
  catagoryName: FormControl<ICatagory['catagoryName']>;
};

export type CatagoryFormGroup = FormGroup<CatagoryFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CatagoryFormService {
  createCatagoryFormGroup(catagory: CatagoryFormGroupInput = { id: null }): CatagoryFormGroup {
    const catagoryRawValue = {
      ...this.getFormDefaults(),
      ...catagory,
    };
    return new FormGroup<CatagoryFormGroupContent>({
      id: new FormControl(
        { value: catagoryRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      catagoryId: new FormControl(catagoryRawValue.catagoryId, {
        validators: [Validators.required],
      }),
      catagoryName: new FormControl(catagoryRawValue.catagoryName),
    });
  }

  getCatagory(form: CatagoryFormGroup): ICatagory | NewCatagory {
    return form.getRawValue() as ICatagory | NewCatagory;
  }

  resetForm(form: CatagoryFormGroup, catagory: CatagoryFormGroupInput): void {
    const catagoryRawValue = { ...this.getFormDefaults(), ...catagory };
    form.reset(
      {
        ...catagoryRawValue,
        id: { value: catagoryRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): CatagoryFormDefaults {
    return {
      id: null,
    };
  }
}
