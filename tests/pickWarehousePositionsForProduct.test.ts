import { WarehousePosition } from "../models/interfaces/orderPicking";
import { pickWarehousePositionsForProduct } from "../routes/functions";

describe("pickWarehousePositionsForProduct", () => {
  it("should pick warehouse positions for product", () => {
    // Define mock data
    const warehousePositions = [
      {
        positionId: "position-1",
        x: 1,
        y: 1,
        z: 1,
        productId: "product-1",
        quantity: 3,
      },
      {
        positionId: "position-2",
        x: 2,
        y: 2,
        z: 2,
        productId: "product-1",
        quantity: 2,
      },
      {
        positionId: "position-3",
        x: 3,
        y: 3,
        z: 3,
        productId: "product-1",
        quantity: 1,
      },
    ];
    const quantityToPick = 4;

    // Call the function
    const result = pickWarehousePositionsForProduct(
      warehousePositions,
      quantityToPick
    );

    // Check result
    expect(result).toEqual([
      { productId: "product-1", positionId: "position-3", quantity: 1 },
      { productId: "product-1", positionId: "position-2", quantity: 2 },
      { productId: "product-1", positionId: "position-1", quantity: 1 },
    ]);
  });

  it("should throw an error if there is not enough quantity", () => {
    // Define mock data
    const warehousePositions = [
      {
        positionId: "position-1",
        x: 1,
        y: 1,
        z: 1,
        productId: "product-1",
        quantity: 1,
      },
    ];
    const quantityToPick = 2;

    // Call the function and check for error
    expect(() =>
      pickWarehousePositionsForProduct(warehousePositions, quantityToPick)
    ).toThrowError("Could not find enough quantity for product product-1");
  });

  it("should return an empty array if there are no warehouse positions", () => {
    // Define mock data
    const warehousePositions: WarehousePosition[] = [];
    const quantityToPick = 1;

    // Call the function
    const result = pickWarehousePositionsForProduct(
      warehousePositions,
      quantityToPick
    );

    // Check result
    expect(result).toEqual([]);
  });
});
