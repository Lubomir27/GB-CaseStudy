import express from "express";
import {
  getAllProductWarehousePositions,
  pickWarehousePositionsForProduct,
} from "../routes/functions";
import orderPickingRouter from "../routes/orderPickingRouter";
import request from "supertest";
import axios from "axios";
import { WarehousePosition } from "../models/interfaces/orderPicking";

jest.mock("axios");

// Mock the functions
jest.mock("../routes/functions", () => ({
  getAllProductWarehousePositions: jest.fn(),
  pickWarehousePositionsForProduct: jest.fn(),
}));

describe("Order picking API", () => {
  const app = express();
  app.use(express.json());
  app.use("/order-picking", orderPickingRouter);

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should return the correct order positions for productId product-2", async () => {
    // Define mock data
    const mockOrder = [{ productId: "product-2", quantity: 5 }];
    const mockWarehousePositions = [
      {
        positionId: "position-241",
        x: 3,
        y: 12,
        z: 0,
        productId: "product-2",
        quantity: 12,
      },
      {
        positionId: "position-245",
        x: 15,
        y: 12,
        z: 0,
        productId: "product-2",
        quantity: 5,
      },
      {
        positionId: "position-234",
        x: 72,
        y: 11,
        z: 0,
        productId: "product-2",
        quantity: 12,
      },
    ];

    const mockPickedPositions = [
      { productId: "product-2", positionId: "position-245", quantity: 5 },
    ];

    // Set up mock functions to return mock data
    (
      getAllProductWarehousePositions as jest.MockedFunction<
        typeof getAllProductWarehousePositions
      >
    ).mockResolvedValueOnce(mockWarehousePositions);
    (
      pickWarehousePositionsForProduct as jest.MockedFunction<
        typeof pickWarehousePositionsForProduct
      >
    ).mockReturnValueOnce(mockPickedPositions);

    // Make request to API endpoint
    const response = await request(app).get("/order-picking").send(mockOrder);

    // Check response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockPickedPositions);
    expect(getAllProductWarehousePositions).toHaveBeenCalledTimes(1);
    expect(pickWarehousePositionsForProduct).toHaveBeenNthCalledWith(
      1,
      mockWarehousePositions,
      5
    );
    expect(getAllProductWarehousePositions).toHaveBeenNthCalledWith(
      1,
      "product-2"
    );
  });

  it("should return 404 if no positions found for productId product-2", async () => {
    // Set up mock functions to return empty warehouse positions
    (
      getAllProductWarehousePositions as jest.MockedFunction<
        typeof getAllProductWarehousePositions
      >
    ).mockResolvedValueOnce([]);

    // Make request to API endpoint
    const response = await request(app)
      .get("/order-picking")
      .send([{ productId: "product-2", quantity: 5 }]);

    // Check response
    expect(response.status).toBe(404);
    expect(response.text).toBe("No positions found for product product-2");
    expect(getAllProductWarehousePositions).toHaveBeenCalledTimes(1);
  });
});
