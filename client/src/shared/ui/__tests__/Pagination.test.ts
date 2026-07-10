import { getPaginationData } from "../Pagination/Pagination.helpers";
import { randomNumbers } from "test/generate";

describe("getPaginationData", () => {
  test("shows no more than 9 page buttons", () => {
    const currentPage = 1;
    const totalPages = randomNumbers(15);

    for (let i = 0; i < totalPages.length; i++) {
      const pages = getPaginationData(currentPage, totalPages[i]);

      expect(pages.length).toBeLessThan(10);
    }
  });

  test("has its first button always pointing to the first page", () => {
    const currentPage = 1;
    const totalPages = randomNumbers(15);

    for (let i = 0; i < totalPages.length; i++) {
      const pages = getPaginationData(currentPage, totalPages[i]);

      expect(pages[0].page).toEqual(1);
    }
  });

  test("has its last button always pointing to the last page", () => {
    const currentPage = 1;
    const totalPages = randomNumbers(15);

    for (let i = 0; i < totalPages.length; i++) {
      const pages = getPaginationData(currentPage, totalPages[i]);

      expect(pages[pages.length - 1].page).toEqual(totalPages[i]);
    }
  });

  test("returns correct page numbers if totalPages is less than or equal to 9", () => {
    const currentPage = 1;
    const totalPages = randomNumbers(9);

    for (let i = 0; i < totalPages.length; i++) {
      const pages = getPaginationData(currentPage, totalPages[i]);
      const expectedPages = Array.from({ length: pages.length }, (_, idx) => ({
        page: idx + 1
      }));

      expect(pages).toEqual(expectedPages);
    }
  });

  describe("returns correct page numbers if totalPages is more than 9", () => {
    test("and currentPage is less than or equal 5", () => {
      expect(getPaginationData(5, 10)).toEqual([
        { page: 1 },
        { page: 2 },
        { page: 3 },
        { page: 4 },
        { page: 5 },
        { page: 6 },
        { page: 7 },
        { page: 8, isSpread: true },
        { page: 10 }
      ]);

      expect(getPaginationData(3, 13)).toEqual([
        { page: 1 },
        { page: 2 },
        { page: 3 },
        { page: 4 },
        { page: 5 },
        { page: 6 },
        { page: 7 },
        { page: 8, isSpread: true },
        { page: 13 }
      ]);
    });

    test("and currentPage is more than 5 and less than totalPages - 4", () => {
      expect(getPaginationData(6, 77)).toEqual([
        { page: 1 },
        { page: 3, isSpread: true },
        { page: 4 },
        { page: 5 },
        { page: 6 },
        { page: 7 },
        { page: 8 },
        { page: 9, isSpread: true },
        { page: 77 }
      ]);

      expect(getPaginationData(66, 177)).toEqual([
        { page: 1 },
        { page: 63, isSpread: true },
        { page: 64 },
        { page: 65 },
        { page: 66 },
        { page: 67 },
        { page: 68 },
        { page: 69, isSpread: true },
        { page: 177 }
      ]);

      expect(getPaginationData(372, 377)).toEqual([
        { page: 1 },
        { page: 369, isSpread: true },
        { page: 370 },
        { page: 371 },
        { page: 372 },
        { page: 373 },
        { page: 374 },
        { page: 375, isSpread: true },
        { page: 377 }
      ]);
    });

    test("and currentPage is between totalPages - 4 and totalPages", () => {
      expect(getPaginationData(73, 77)).toEqual([
        { page: 1 },
        { page: 70, isSpread: true },
        { page: 71 },
        { page: 72 },
        { page: 73 },
        { page: 74 },
        { page: 75 },
        { page: 76 },
        { page: 77 }
      ]);

      expect(getPaginationData(177, 177)).toEqual([
        { page: 1 },
        { page: 170, isSpread: true },
        { page: 171 },
        { page: 172 },
        { page: 173 },
        { page: 174 },
        { page: 175 },
        { page: 176 },
        { page: 177 }
      ]);

      expect(getPaginationData(374, 377)).toEqual([
        { page: 1 },
        { page: 370, isSpread: true },
        { page: 371 },
        { page: 372 },
        { page: 373 },
        { page: 374 },
        { page: 375 },
        { page: 376 },
        { page: 377 }
      ]);
    });
  });
});
