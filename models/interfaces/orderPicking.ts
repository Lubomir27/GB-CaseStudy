export interface WarehousePosition {
  positionId: string;
  x: number;
  y: number;
  z: number;
  productId: string;
  quantity: number;
}

export interface Order {
  productId: string;
  quantity: number;
}

export interface OrderPosition {
  productId: string;
  positionId: string;
  quantity: number;
}
