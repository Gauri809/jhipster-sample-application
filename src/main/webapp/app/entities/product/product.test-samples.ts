import { IProduct, NewProduct } from './product.model';

export const sampleWithRequiredData: IProduct = {
  id: 77672,
  productId: 31113,
};

export const sampleWithPartialData: IProduct = {
  id: 96307,
  productId: 78560,
  userGender: 'Brand Programmable',
};

export const sampleWithFullData: IProduct = {
  id: 22539,
  productId: 49054,
  productName: 'deliver',
  productPrice: 39641,
  userGender: 'mindshare Stravenue invoice',
};

export const sampleWithNewData: NewProduct = {
  productId: 80148,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
