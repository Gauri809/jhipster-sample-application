import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ITitle, NewTitle } from '../title.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ITitle for edit and NewTitleFormGroupInput for create.
 */
type TitleFormGroupInput = ITitle | PartialWithRequiredKeyOf<NewTitle>;

type TitleFormDefaults = Pick<NewTitle, 'id'>;

type TitleFormGroupContent = {
  id: FormControl<ITitle['id'] | NewTitle['id']>;
  description: FormControl<ITitle['description']>;
  height: FormControl<ITitle['height']>;
  width: FormControl<ITitle['width']>;
  weight: FormControl<ITitle['weight']>;
};

export type TitleFormGroup = FormGroup<TitleFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class TitleFormService {
  createTitleFormGroup(title: TitleFormGroupInput = { id: null }): TitleFormGroup {
    const titleRawValue = {
      ...this.getFormDefaults(),
      ...title,
    };
    return new FormGroup<TitleFormGroupContent>({
      id: new FormControl(
        { value: titleRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      description: new FormControl(titleRawValue.description),
      height: new FormControl(titleRawValue.height),
      width: new FormControl(titleRawValue.width),
      weight: new FormControl(titleRawValue.weight),
    });
  }

  getTitle(form: TitleFormGroup): ITitle | NewTitle {
    return form.getRawValue() as ITitle | NewTitle;
  }

  resetForm(form: TitleFormGroup, title: TitleFormGroupInput): void {
    const titleRawValue = { ...this.getFormDefaults(), ...title };
    form.reset(
      {
        ...titleRawValue,
        id: { value: titleRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): TitleFormDefaults {
    return {
      id: null,
    };
  }
}
