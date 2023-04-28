import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { DiscountService } from '../service/discount.service';

import { DiscountComponent } from './discount.component';

describe('Discount Management Component', () => {
  let comp: DiscountComponent;
  let fixture: ComponentFixture<DiscountComponent>;
  let service: DiscountService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'discount', component: DiscountComponent }]), HttpClientTestingModule],
      declarations: [DiscountComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(DiscountComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DiscountComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(DiscountService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.discounts?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to discountService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getDiscountIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getDiscountIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
