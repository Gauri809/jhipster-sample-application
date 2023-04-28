import dayjs from 'dayjs/esm';

import { IDiscount, NewDiscount } from './discount.model';

export const sampleWithRequiredData: IDiscount = {
  id: 61250,
  discountPersontage: 50111,
};

export const sampleWithPartialData: IDiscount = {
  id: 92067,
  endDate: dayjs('2023-04-27T21:41'),
  discountPersontage: 61965,
};

export const sampleWithFullData: IDiscount = {
  id: 88439,
  startDate: dayjs('2023-04-28T05:56'),
  endDate: dayjs('2023-04-27T21:10'),
  discountPersontage: 45487,
};

export const sampleWithNewData: NewDiscount = {
  discountPersontage: 52849,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
