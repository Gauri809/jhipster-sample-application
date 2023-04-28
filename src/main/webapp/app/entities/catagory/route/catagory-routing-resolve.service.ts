import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICatagory } from '../catagory.model';
import { CatagoryService } from '../service/catagory.service';

@Injectable({ providedIn: 'root' })
export class CatagoryRoutingResolveService implements Resolve<ICatagory | null> {
  constructor(protected service: CatagoryService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICatagory | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((catagory: HttpResponse<ICatagory>) => {
          if (catagory.body) {
            return of(catagory.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
