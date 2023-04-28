import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CatagoryDetailComponent } from './catagory-detail.component';

describe('Catagory Management Detail Component', () => {
  let comp: CatagoryDetailComponent;
  let fixture: ComponentFixture<CatagoryDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CatagoryDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ catagory: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(CatagoryDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(CatagoryDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load catagory on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.catagory).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
