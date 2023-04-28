import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICatagory } from '../catagory.model';
import { CatagoryService } from '../service/catagory.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './catagory-delete-dialog.component.html',
})
export class CatagoryDeleteDialogComponent {
  catagory?: ICatagory;

  constructor(protected catagoryService: CatagoryService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.catagoryService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
