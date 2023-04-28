export interface ICatagory {
  id: number;
  catagoryId?: number | null;
  catagoryName?: string | null;
}

export type NewCatagory = Omit<ICatagory, 'id'> & { id: null };
