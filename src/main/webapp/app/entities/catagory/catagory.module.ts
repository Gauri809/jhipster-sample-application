import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CatagoryComponent } from './list/catagory.component';
import { CatagoryDetailComponent } from './detail/catagory-detail.component';
import { CatagoryUpdateComponent } from './update/catagory-update.component';
import { CatagoryDeleteDialogComponent } from './delete/catagory-delete-dialog.component';
import { CatagoryRoutingModule } from './route/catagory-routing.module';

@NgModule({
  imports: [SharedModule, CatagoryRoutingModule],
  declarations: [CatagoryComponent, CatagoryDetailComponent, CatagoryUpdateComponent, CatagoryDeleteDialogComponent],
})
export class CatagoryModule {}
