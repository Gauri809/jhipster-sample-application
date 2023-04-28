export interface ITitle {
  id: number;
  description?: string | null;
  height?: number | null;
  width?: number | null;
  weight?: number | null;
}

export type NewTitle = Omit<ITitle, 'id'> & { id: null };
