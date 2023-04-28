import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CatagoryComponent } from '../list/catagory.component';
import { CatagoryDetailComponent } from '../detail/catagory-detail.component';
import { CatagoryUpdateComponent } from '../update/catagory-update.component';
import { CatagoryRoutingResolveService } from './catagory-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const catagoryRoute: Routes = [
  {
    path: '',
    component: CatagoryComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CatagoryDetailComponent,
    resolve: {
      catagory: CatagoryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CatagoryUpdateComponent,
    resolve: {
      catagory: CatagoryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CatagoryUpdateComponent,
    resolve: {
      catagory: CatagoryRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(catagoryRoute)],
  exports: [RouterModule],
})
export class CatagoryRoutingModule {}
