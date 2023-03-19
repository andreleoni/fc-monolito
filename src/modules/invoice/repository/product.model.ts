import { Column, Model, ForeignKey, BelongsTo, PrimaryKey, Table } from "sequelize-typescript";
import InvoiceModel from "./invoice.model";

@Table({ tableName: "products", timestamps: false })
export default class ProductModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  id: string;

  @Column({ allowNull: false })
  name: string;

  @Column({ allowNull: false })
  description: string;

  @Column({ allowNull: false })
  stock: number;

  @Column({ allowNull: false, field: "price" })
  price: number;

  @ForeignKey(() => InvoiceModel)
  @Column({ allowNull: false })
  invoice_id: string;

  @BelongsTo(() => InvoiceModel)
  invoice: InvoiceModel;
}
