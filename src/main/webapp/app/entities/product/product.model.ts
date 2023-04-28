import { ITitle } from 'app/entities/title/title.model';
import { IDiscount } from 'app/entities/discount/discount.model';
import { ICatagory } from 'app/entities/catagory/catagory.model';

export interface IProduct {
  id: number;
  productId?: number | null;
  productName?: string | null;
  productPrice?: number | null;
  userGender?: string | null;
  title?: Pick<ITitle, 'id'> | null;
  discount?: Pick<IDiscount, 'id'> | null;
  catagory?: Pick<ICatagory, 'id'> | null;
}

export type NewProduct = Omit<IProduct, 'id'> & { id: null };
