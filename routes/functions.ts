import axios from "axios";
import {
  WarehousePosition,
  OrderPosition,
} from "../models/interfaces/orderPicking";
require("dotenv").config();

const baseUrl = "https://dev.aux.boxpi.com/case-study";
const apiKey = process.env.ORDER_POSITION_API_KEY;

export const getAllProductWarehousePositions = async (
  productId: string
): Promise<WarehousePosition[]> => {
  const response = await axios.get<WarehousePosition[]>(
    `${baseUrl}/products/${productId}/positions`,
    {
      headers: { "x-api-key": apiKey },
    }
  );

  return response.data;
};

export const pickWarehousePositionsForProduct = (
  warehousePositions: WarehousePosition[],
  quantityToPick: number
): OrderPosition[] => {
  if (warehousePositions.length === 0) {
    return [];
  }
  const sortedPositions = [...warehousePositions].sort(
    (a, b) => a.quantity - b.quantity
  );
  let remainingQuantity = quantityToPick;
  const pickedPositions: OrderPosition[] = [];
  for (const position of sortedPositions) {
    if (position.quantity > 0) {
      const quantityPicked = Math.min(position.quantity, remainingQuantity);
      pickedPositions.push({
        productId: position.productId,
        positionId: position.positionId,
        quantity: quantityPicked,
      });
      remainingQuantity -= quantityPicked;
      if (remainingQuantity === 0) {
        break;
      }
    }
  }

  if (remainingQuantity > 0) {
    throw new Error(
      `Could not find enough quantity for product ${warehousePositions[0].productId}`
    );
  }

  return pickedPositions;
};
