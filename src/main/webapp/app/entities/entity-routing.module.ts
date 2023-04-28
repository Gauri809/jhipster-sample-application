import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'product',
        data: { pageTitle: 'jhipsterSampleApplicationApp.product.home.title' },
        loadChildren: () => import('./product/product.module').then(m => m.ProductModule),
      },
      {
        path: 'catagory',
        data: { pageTitle: 'jhipsterSampleApplicationApp.catagory.home.title' },
        loadChildren: () => import('./catagory/catagory.module').then(m => m.CatagoryModule),
      },
      {
        path: 'title',
        data: { pageTitle: 'jhipsterSampleApplicationApp.title.home.title' },
        loadChildren: () => import('./title/title.module').then(m => m.TitleModule),
      },
      {
        path: 'discount',
        data: { pageTitle: 'jhipsterSampleApplicationApp.discount.home.title' },
        loadChildren: () => import('./discount/discount.module').then(m => m.DiscountModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
