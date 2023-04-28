import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IProduct, NewProduct } from '../product.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IProduct for edit and NewProductFormGroupInput for create.
 */
type ProductFormGroupInput = IProduct | PartialWithRequiredKeyOf<NewProduct>;

type ProductFormDefaults = Pick<NewProduct, 'id'>;

type ProductFormGroupContent = {
  id: FormControl<IProduct['id'] | NewProduct['id']>;
  productId: FormControl<IProduct['productId']>;
  productName: FormControl<IProduct['productName']>;
  productPrice: FormControl<IProduct['productPrice']>;
  userGender: FormControl<IProduct['userGender']>;
  title: FormControl<IProduct['title']>;
  discount: FormControl<IProduct['discount']>;
  catagory: FormControl<IProduct['catagory']>;
  catagory: FormControl<IProduct['catagory']>;
};

export type ProductFormGroup = FormGroup<ProductFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ProductFormService {
  createProductFormGroup(product: ProductFormGroupInput = { id: null }): ProductFormGroup {
    const productRawValue = {
      ...this.getFormDefaults(),
      ...product,
    };
    return new FormGroup<ProductFormGroupContent>({
      id: new FormControl(
        { value: productRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      productId: new FormControl(productRawValue.productId, {
        validators: [Validators.required],
      }),
      productName: new FormControl(productRawValue.productName),
      productPrice: new FormControl(productRawValue.productPrice),
      userGender: new FormControl(productRawValue.userGender),
      title: new FormControl(productRawValue.title),
      discount: new FormControl(productRawValue.discount),
      catagory: new FormControl(productRawValue.catagory),
      catagory: new FormControl(productRawValue.catagory),
    });
  }

  getProduct(form: ProductFormGroup): IProduct | NewProduct {
    return form.getRawValue() as IProduct | NewProduct;
  }

  resetForm(form: ProductFormGroup, product: ProductFormGroupInput): void {
    const productRawValue = { ...this.getFormDefaults(), ...product };
    form.reset(
      {
        ...productRawValue,
        id: { value: productRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ProductFormDefaults {
    return {
      id: null,
    };
  }
}
