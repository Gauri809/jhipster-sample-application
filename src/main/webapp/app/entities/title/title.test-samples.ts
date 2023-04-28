import { ITitle, NewTitle } from './title.model';

export const sampleWithRequiredData: ITitle = {
  id: 86904,
};

export const sampleWithPartialData: ITitle = {
  id: 57993,
  description: 'Frozen',
  height: 55484,
  weight: 70648,
};

export const sampleWithFullData: ITitle = {
  id: 26751,
  description: 'Cambridgeshire',
  height: 19372,
  width: 29661,
  weight: 21364,
};

export const sampleWithNewData: NewTitle = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
