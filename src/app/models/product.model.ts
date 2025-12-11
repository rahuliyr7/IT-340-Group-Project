export interface Product {
  _id?: string;
  id?: number;
  name: string;
  description: string;
  category: string;
  rarity: string;
  condition?: string;
  images?: string[];
  image?: string;
  price: number;
  isAuction: boolean;
  currentBid?: number;
  reservePrice?: number;
  auctionStart?: Date;
  auctionEnd?: Date;
  bids?: Array<{
    userId: string;
    amount: number;
    timestamp: Date;
  }>;
  sellerId: string;
  sellerName: string;
  status: string;
  verified: boolean;
  soldTo?: string;
  soldDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Notification {
  id: number;
  message: string;
  time: Date;
}
