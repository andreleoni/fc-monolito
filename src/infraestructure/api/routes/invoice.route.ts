import express, { Request, Response } from 'express';
import FindInvoiceUseCase from '../../../modules/invoice/usecase/find-invoice/find-invoice.usecase';
import InvoiceRepository from '../../../modules/invoice/repository/invoice.repository';
import GenerateInvoiceUseCase from '../../../modules/invoice/usecase/generate-invoice/generate-invoice.usecase';
import { Sequelize } from 'sequelize-typescript';
import ProductModel from '../../../modules/invoice/repository/product.model';
import InvoiceModel from '../../../modules/invoice/repository/invoice.model';

export let sequelize: Sequelize;

export const invoiceRoute = express.Router();

async function setupDb() {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
  });

  sequelize.addModels([InvoiceModel, ProductModel]);

  await sequelize.sync();
}

setupDb()

invoiceRoute.post("/", async (req: Request, res: Response) => {
  const usecase = new GenerateInvoiceUseCase(new InvoiceRepository());

  const reqBody = req.body;

  const invoiceDto = {
      name: reqBody.name,
      document: reqBody.document,
      street: reqBody.street,
      number: reqBody.number,
      complement: reqBody.complement,
      city: reqBody.city,
      state: reqBody.state,
      zipCode: reqBody.zipCode,
      items: reqBody.items
  }

  const output = await usecase.execute(invoiceDto);

  res.send(output);
});

invoiceRoute.get('/:invoiceId', async (req: Request, res: Response) => {
  const usecase = new FindInvoiceUseCase(new InvoiceRepository());

  try {
    const invoiceId = String(req.params.invoiceId);

    const output = await usecase.execute({ id: invoiceId });

    res.send(output);
  } catch (err) {
    res.status(500).send(err);
  }
});
