import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import ClientAdmFacadeInterface from "../../../client-adm/facade/client-adm.facade.interface";
import ProductAdmFacadeInterface from "../../../product-adm/facade/product-adm.facade.interface";
import StoreCatalogFacadeInterface from "../../../store-catalog/facade/store-catalog.facade.interface";
import { PlaceOrderInputDto, PlaceOrderOutputDto } from "./place-order.dto";
import Product from "../../domain/product.entity"
import Id from "../../../@shared/domain/value-object/id.value-object";

export default class PlaceOrderUseCase implements UseCaseInterface {
  private _clientFacade: ClientAdmFacadeInterface;
  private _productAdmFacade: ProductAdmFacadeInterface;
  private _storeCatalogFacade: StoreCatalogFacadeInterface;

  constructor(clientFacade: ClientAdmFacadeInterface, productAdmFacade: ProductAdmFacadeInterface, storeCatalogFacade: StoreCatalogFacadeInterface) {
    this._clientFacade = clientFacade;
    this._productAdmFacade = productAdmFacade;
    this._storeCatalogFacade = storeCatalogFacade;
  }

  async execute(input: PlaceOrderInputDto): Promise<PlaceOrderOutputDto> {
    const client = await this._clientFacade.find({ id: input.clientId });
    if (!client) {
      throw new Error("Client not found")
    }

    await this.validateProducts(input)

    return {
      id: "",
      invoiceId: "",
      status: "",
      total: 0,
      products: []
    }
  }

  private async validateProducts(input: PlaceOrderInputDto): Promise<void> {
    // Check if have products
    if (input.products.length === 0) {
      throw new Error("No products selected")
    }

    // Check stock for each product
    for (const p of input.products) {
      const product = await this._productAdmFacade.checkStock({
        productId: p.productId,
      });

      if (product.stock <= 0) {
        throw new Error(
          `Product ${product.productId} is not available in stock`
        )
      }
    }
  }

  private async getProduct(productId: string): Promise<Product> {
    const product = await this._storeCatalogFacade.find({ id: productId });

    if (!product) {
      throw new Error("Product not found");
    }

    const productProps = {
      id: new Id(product.id),
      name: product.name,
      description: product.description,
      salesPrice: product.salesPrice,
    }

    return new Product(productProps);
  }
}
