import PlaceOrderUseCase from "./place-order.usecase"
import { PlaceOrderInputDto } from "./place-order.dto"
import Product from "../../domain/product.entity"
import Id from "../../../@shared/domain/value-object/id.value-object";

describe("PlaceOrderUseCase unit test", () => {
  describe("validateProducts method", () => {
    it("should throw error if no products are selected", async() => {
      const mockStoreCatalogFacade = {
        find: jest.fn().mockResolvedValue(null),
        findAll: jest.fn().mockResolvedValue(null),
      }

      const mockClientFacade = {
        find: jest.fn().mockResolvedValue(null),
        add: jest.fn().mockResolvedValue(null)
      }

      const mockProductFacade = {
        checkStock: jest.fn().mockResolvedValue(null),
        addProduct: jest.fn().mockResolvedValue(null)
      };

      const placeOrderUseCase = new PlaceOrderUseCase(mockClientFacade, mockProductFacade, mockStoreCatalogFacade);

      const input: PlaceOrderInputDto = { clientId: "0", products: [] };

      await expect(placeOrderUseCase["validateProducts"](input)).rejects.toThrow("No products selected")
    })
  });

  describe("getProducts method", () => {
    beforeAll(() => {
      jest.useFakeTimers("modern");
      // jest.setSystemTime(mockDate);
    });

    afterAll(() => {
      jest.useRealTimers;
    });

    it("should throw an error when product not found", async() => {
      const mockStoreCatalogFacade = {
        find: jest.fn().mockResolvedValue(null),
        findAll: jest.fn().mockResolvedValue(null),
      }

      const mockClientFacade = {
        find: jest.fn().mockResolvedValue(null),
        add: jest.fn().mockResolvedValue(null)
      }

      const mockProductFacade = {
        checkStock: jest.fn().mockResolvedValue(null),
        addProduct: jest.fn().mockResolvedValue(null)
      };

      const placeOrderUseCase = new PlaceOrderUseCase(mockClientFacade, mockProductFacade, mockStoreCatalogFacade);

      const input: PlaceOrderInputDto = { clientId: "0", products: [] };

      await expect(placeOrderUseCase["getProduct"]("0")).rejects.toThrow(
        new Error("Product not found")
      )
    })

    it("should return a product", async() => {
      const mockStoreCatalogFacade = {
        find: jest.fn().mockResolvedValue({
          id: "0",
          name: "Product 0",
          description: "Product 0 description",
          salesPrice: 0,
        }),
        findAll: jest.fn().mockResolvedValue(null),
      }

      const mockClientFacade = {
        find: jest.fn().mockResolvedValue(null),
        add: jest.fn().mockResolvedValue(null)
      }

      const mockProductFacade = {
        checkStock: jest.fn().mockResolvedValue(null),
        addProduct: jest.fn().mockResolvedValue(null)
      };

      const placeOrderUseCase = new PlaceOrderUseCase(mockClientFacade, mockProductFacade, mockStoreCatalogFacade);

      await expect(placeOrderUseCase["getProduct"]("0")).resolves.toEqual(
        new Product({
          id: new Id("0"),
          name: "Product 0",
          description: "Product 0 description",
          salesPrice: 0,
        })
      )

      expect(mockStoreCatalogFacade.find).toHaveBeenCalledTimes(1);
    });
  })

  it("should throw error when products is out of stock", async() => {
    const mockStoreCatalogFacade = {
      find: jest.fn().mockResolvedValue(null),
      findAll: jest.fn().mockResolvedValue(null),
    }

    const mockClientFacade = {
      find: jest.fn().mockResolvedValue(null),
      add: jest.fn().mockResolvedValue(null)
    }

    const mockProductFacade = {
      checkStock: jest.fn(({ productId }: { productId: string }) =>
        Promise.resolve({
          productId,
          stock: productId ==="1" ? 0 : 1,
        })
      ),
      addProduct: jest.fn().mockResolvedValue(null)
    };

    const placeOrderUseCase = new PlaceOrderUseCase(mockClientFacade, mockProductFacade, mockStoreCatalogFacade);

    let input: PlaceOrderInputDto = { clientId: "0", products: [{ productId: "1" }] };

    await expect(placeOrderUseCase["validateProducts"](input)).rejects.toThrow("Product 1 is not available in stock")

    input = { clientId: "0", products: [{ productId: "0" }, { productId: "1" }] };

    await expect(placeOrderUseCase["validateProducts"](input)).rejects.toThrow("Product 1 is not available in stock")

    expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(3)

    input = { clientId: "0", products: [{ productId: "0" }, { productId: "1" }, { productId: "2" }] };

    await expect(placeOrderUseCase["validateProducts"](input)).rejects.toThrow("Product 1 is not available in stock")

    expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(5)
  });

  describe("execute method", () => {
    it("should throw an error when client not found", async() => {
      const mockStoreCatalogFacade = {
        find: jest.fn().mockResolvedValue(null),
        findAll: jest.fn().mockResolvedValue(null),
      }

      const mockClientFacade = {
        find: jest.fn().mockResolvedValue(null),
        add: jest.fn().mockResolvedValue(null)
      }

      const mockProductFacade = {
        checkStock: jest.fn().mockResolvedValue(null),
        addProduct: jest.fn().mockResolvedValue(null)
      };

      const placeOrderUseCase = new PlaceOrderUseCase(mockClientFacade, mockProductFacade, mockStoreCatalogFacade);

      const input: PlaceOrderInputDto = { clientId: "0", products: [] };

      await expect(placeOrderUseCase.execute(input)).rejects.toThrow(
        new Error("Client not found")
      )
    })

    it("should throw an error whtn products are not valid", async() => {
      const mockStoreCatalogFacade = {
        find: jest.fn().mockResolvedValue(null),
        findAll: jest.fn().mockResolvedValue(null),
      }

      const mockClientFacade = {
        find: jest.fn().mockResolvedValue(true),
        add: jest.fn().mockResolvedValue(null)
      }

      const mockProductFacade = {
        checkStock: jest.fn().mockResolvedValue(null),
        addProduct: jest.fn().mockResolvedValue(null)
      };

      const placeOrderUseCase = new PlaceOrderUseCase(mockClientFacade, mockProductFacade, mockStoreCatalogFacade);

      const mockValidateProducts =
        //@ts-expect-error - spy on private method
        jest.spyOn(placeOrderUseCase, "validateProducts")
        //@ts-expect-error - not return never
        .mockRejectedValue(new Error("No products selected"))

      const input: PlaceOrderInputDto = { clientId: "1", products: [] };

      await expect(placeOrderUseCase.execute(input)).rejects.toThrow(new Error("No products selected"))

      expect(mockValidateProducts).toHaveBeenCalledTimes(1)
    })
  })
})
