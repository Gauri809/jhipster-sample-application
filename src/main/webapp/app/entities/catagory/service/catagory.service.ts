import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICatagory, NewCatagory } from '../catagory.model';

export type PartialUpdateCatagory = Partial<ICatagory> & Pick<ICatagory, 'id'>;

export type EntityResponseType = HttpResponse<ICatagory>;
export type EntityArrayResponseType = HttpResponse<ICatagory[]>;

@Injectable({ providedIn: 'root' })
export class CatagoryService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/catagories');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(catagory: NewCatagory): Observable<EntityResponseType> {
    return this.http.post<ICatagory>(this.resourceUrl, catagory, { observe: 'response' });
  }

  update(catagory: ICatagory): Observable<EntityResponseType> {
    return this.http.put<ICatagory>(`${this.resourceUrl}/${this.getCatagoryIdentifier(catagory)}`, catagory, { observe: 'response' });
  }

  partialUpdate(catagory: PartialUpdateCatagory): Observable<EntityResponseType> {
    return this.http.patch<ICatagory>(`${this.resourceUrl}/${this.getCatagoryIdentifier(catagory)}`, catagory, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICatagory>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICatagory[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCatagoryIdentifier(catagory: Pick<ICatagory, 'id'>): number {
    return catagory.id;
  }

  compareCatagory(o1: Pick<ICatagory, 'id'> | null, o2: Pick<ICatagory, 'id'> | null): boolean {
    return o1 && o2 ? this.getCatagoryIdentifier(o1) === this.getCatagoryIdentifier(o2) : o1 === o2;
  }

  addCatagoryToCollectionIfMissing<Type extends Pick<ICatagory, 'id'>>(
    catagoryCollection: Type[],
    ...catagoriesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const catagories: Type[] = catagoriesToCheck.filter(isPresent);
    if (catagories.length > 0) {
      const catagoryCollectionIdentifiers = catagoryCollection.map(catagoryItem => this.getCatagoryIdentifier(catagoryItem)!);
      const catagoriesToAdd = catagories.filter(catagoryItem => {
        const catagoryIdentifier = this.getCatagoryIdentifier(catagoryItem);
        if (catagoryCollectionIdentifiers.includes(catagoryIdentifier)) {
          return false;
        }
        catagoryCollectionIdentifiers.push(catagoryIdentifier);
        return true;
      });
      return [...catagoriesToAdd, ...catagoryCollection];
    }
    return catagoryCollection;
  }
}
