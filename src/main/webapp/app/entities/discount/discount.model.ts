import dayjs from 'dayjs/esm';

export interface IDiscount {
  id: number;
  startDate?: dayjs.Dayjs | null;
  endDate?: dayjs.Dayjs | null;
  discountPersontage?: number | null;
}

export type NewDiscount = Omit<IDiscount, 'id'> & { id: null };
