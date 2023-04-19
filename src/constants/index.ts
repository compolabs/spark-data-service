import tokens from "./tokens.json";

export const TOKENS_LIST: Array<IToken> = Object.values(tokens).map((t) => ({
  ...t,
}));
export const TOKENS_BY_SYMBOL: Record<string, IToken> = TOKENS_LIST.reduce(
  (acc, t) => ({ ...acc, [t.symbol]: t }),
  {}
);
export const TOKENS_BY_ASSET_ID: Record<string, IToken> = TOKENS_LIST.reduce(
  (acc, t) => ({ ...acc, [t.assetId]: t }),
  {}
);
export const CONTRACT_ADDRESSES = {
  limitOrders: "0x7662a02959e3e2d681589261e95a7a4bc8ac66c6d66999a0fe01bb6c36ada7c6",
};

export const NODE_URL = "https://beta-3.fuel.network/graphql";

export interface IToken {
  assetId: string;
  name: string;
  symbol: string;
  decimals: number;
}
