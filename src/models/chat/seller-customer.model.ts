import mongoose, { Model, Schema } from "mongoose";

export interface ISellerCostumer {
  myId: String;
  myFriends: String[];
}

const sellerCustomerchema: Schema<ISellerCostumer> = new mongoose.Schema(
  {
    myId: {
      type: String,
      required: true,
    },
    myFriends: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export const sellerCostumerModel: Model<ISellerCostumer> = mongoose.model(
  "Seller_Costumers",
  sellerCustomerchema
);
