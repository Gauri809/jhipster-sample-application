import { ICatagory, NewCatagory } from './catagory.model';

export const sampleWithRequiredData: ICatagory = {
  id: 38197,
  catagoryId: 65309,
};

export const sampleWithPartialData: ICatagory = {
  id: 39181,
  catagoryId: 79991,
};

export const sampleWithFullData: ICatagory = {
  id: 4843,
  catagoryId: 75963,
  catagoryName: 'Buckinghamshire hacking Unbranded',
};

export const sampleWithNewData: NewCatagory = {
  catagoryId: 3598,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
