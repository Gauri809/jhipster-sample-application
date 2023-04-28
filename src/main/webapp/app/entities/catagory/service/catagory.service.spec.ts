import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICatagory } from '../catagory.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../catagory.test-samples';

import { CatagoryService } from './catagory.service';

const requireRestSample: ICatagory = {
  ...sampleWithRequiredData,
};

describe('Catagory Service', () => {
  let service: CatagoryService;
  let httpMock: HttpTestingController;
  let expectedResult: ICatagory | ICatagory[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CatagoryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Catagory', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const catagory = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(catagory).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Catagory', () => {
      const catagory = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(catagory).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Catagory', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Catagory', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Catagory', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addCatagoryToCollectionIfMissing', () => {
      it('should add a Catagory to an empty array', () => {
        const catagory: ICatagory = sampleWithRequiredData;
        expectedResult = service.addCatagoryToCollectionIfMissing([], catagory);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(catagory);
      });

      it('should not add a Catagory to an array that contains it', () => {
        const catagory: ICatagory = sampleWithRequiredData;
        const catagoryCollection: ICatagory[] = [
          {
            ...catagory,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addCatagoryToCollectionIfMissing(catagoryCollection, catagory);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Catagory to an array that doesn't contain it", () => {
        const catagory: ICatagory = sampleWithRequiredData;
        const catagoryCollection: ICatagory[] = [sampleWithPartialData];
        expectedResult = service.addCatagoryToCollectionIfMissing(catagoryCollection, catagory);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(catagory);
      });

      it('should add only unique Catagory to an array', () => {
        const catagoryArray: ICatagory[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const catagoryCollection: ICatagory[] = [sampleWithRequiredData];
        expectedResult = service.addCatagoryToCollectionIfMissing(catagoryCollection, ...catagoryArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const catagory: ICatagory = sampleWithRequiredData;
        const catagory2: ICatagory = sampleWithPartialData;
        expectedResult = service.addCatagoryToCollectionIfMissing([], catagory, catagory2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(catagory);
        expect(expectedResult).toContain(catagory2);
      });

      it('should accept null and undefined values', () => {
        const catagory: ICatagory = sampleWithRequiredData;
        expectedResult = service.addCatagoryToCollectionIfMissing([], null, catagory, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(catagory);
      });

      it('should return initial array if no Catagory is added', () => {
        const catagoryCollection: ICatagory[] = [sampleWithRequiredData];
        expectedResult = service.addCatagoryToCollectionIfMissing(catagoryCollection, undefined, null);
        expect(expectedResult).toEqual(catagoryCollection);
      });
    });

    describe('compareCatagory', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareCatagory(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareCatagory(entity1, entity2);
        const compareResult2 = service.compareCatagory(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareCatagory(entity1, entity2);
        const compareResult2 = service.compareCatagory(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareCatagory(entity1, entity2);
        const compareResult2 = service.compareCatagory(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
