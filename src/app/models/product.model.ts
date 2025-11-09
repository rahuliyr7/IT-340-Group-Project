export interface Product {
  id: number;
  name: string;
  price: number;
  currentBid?: number;
  auctionEnd?: Date;
  image: string;
  category: string;
  rarity: string;
  verified: boolean;
  isAuction: boolean;
  bids?: number;
}

export interface Notification {
  id: number;
  message: string;
  time: Date;
}