import { Router } from "express";

import {
  Order,
  OrderPosition,
  WarehousePosition,
} from "../models/interfaces/orderPicking";
import {
  getAllProductWarehousePositions,
  pickWarehousePositionsForProduct,
} from "./functions";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const order: Order[] = req.body;
    const orderPositions: OrderPosition[] = [];

    for (const product of order) {
      const warehousePositions: WarehousePosition[] =
        await getAllProductWarehousePositions(product.productId);

      if (warehousePositions === undefined || warehousePositions.length === 0) {
        throw new Error(`No positions found for product ${product.productId}`);
      }

      const pickedPositions = pickWarehousePositionsForProduct(
        warehousePositions,
        product.quantity
      );

      orderPositions.push(...pickedPositions);
    }
    res.status(200).json(orderPositions);
  } catch (e) {
    if (e instanceof Error) {
      if (e.message.startsWith("No positions found for product")) {
        res.status(404).send(e.message);
      } else if (e.message.startsWith("Could not find enough quantity")) {
        res.status(400).send(e.message);
      } else {
        res.status(500).send("An error occurred while processing the order");
      }
    } else {
      res.status(500).send("An error occurred while processing the order");
    }
  }
});

export default router;
