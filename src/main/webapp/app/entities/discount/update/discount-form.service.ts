import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IDiscount, NewDiscount } from '../discount.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IDiscount for edit and NewDiscountFormGroupInput for create.
 */
type DiscountFormGroupInput = IDiscount | PartialWithRequiredKeyOf<NewDiscount>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IDiscount | NewDiscount> = Omit<T, 'startDate' | 'endDate'> & {
  startDate?: string | null;
  endDate?: string | null;
};

type DiscountFormRawValue = FormValueOf<IDiscount>;

type NewDiscountFormRawValue = FormValueOf<NewDiscount>;

type DiscountFormDefaults = Pick<NewDiscount, 'id' | 'startDate' | 'endDate'>;

type DiscountFormGroupContent = {
  id: FormControl<DiscountFormRawValue['id'] | NewDiscount['id']>;
  startDate: FormControl<DiscountFormRawValue['startDate']>;
  endDate: FormControl<DiscountFormRawValue['endDate']>;
  discountPersontage: FormControl<DiscountFormRawValue['discountPersontage']>;
};

export type DiscountFormGroup = FormGroup<DiscountFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class DiscountFormService {
  createDiscountFormGroup(discount: DiscountFormGroupInput = { id: null }): DiscountFormGroup {
    const discountRawValue = this.convertDiscountToDiscountRawValue({
      ...this.getFormDefaults(),
      ...discount,
    });
    return new FormGroup<DiscountFormGroupContent>({
      id: new FormControl(
        { value: discountRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      startDate: new FormControl(discountRawValue.startDate),
      endDate: new FormControl(discountRawValue.endDate),
      discountPersontage: new FormControl(discountRawValue.discountPersontage, {
        validators: [Validators.required],
      }),
    });
  }

  getDiscount(form: DiscountFormGroup): IDiscount | NewDiscount {
    return this.convertDiscountRawValueToDiscount(form.getRawValue() as DiscountFormRawValue | NewDiscountFormRawValue);
  }

  resetForm(form: DiscountFormGroup, discount: DiscountFormGroupInput): void {
    const discountRawValue = this.convertDiscountToDiscountRawValue({ ...this.getFormDefaults(), ...discount });
    form.reset(
      {
        ...discountRawValue,
        id: { value: discountRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): DiscountFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      startDate: currentTime,
      endDate: currentTime,
    };
  }

  private convertDiscountRawValueToDiscount(rawDiscount: DiscountFormRawValue | NewDiscountFormRawValue): IDiscount | NewDiscount {
    return {
      ...rawDiscount,
      startDate: dayjs(rawDiscount.startDate, DATE_TIME_FORMAT),
      endDate: dayjs(rawDiscount.endDate, DATE_TIME_FORMAT),
    };
  }

  private convertDiscountToDiscountRawValue(
    discount: IDiscount | (Partial<NewDiscount> & DiscountFormDefaults)
  ): DiscountFormRawValue | PartialWithRequiredKeyOf<NewDiscountFormRawValue> {
    return {
      ...discount,
      startDate: discount.startDate ? discount.startDate.format(DATE_TIME_FORMAT) : undefined,
      endDate: discount.endDate ? discount.endDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
