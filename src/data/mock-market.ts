export interface StockMovers {
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
    volume?: string;
    sparkline: number[];
}

export interface MarketIndex {
    name: string;
    value: number;
    change: number;
    changePercent: number;
    sparkline: number[];
}

export const mockIndices: MarketIndex[] = [
    {
        name: "GSE Composite",
        value: 3245.67,
        change: 12.45,
        changePercent: 0.38,
        sparkline: [3200, 3210, 3205, 3230, 3240, 3245],
    },
    {
        name: "GSE Financial",
        value: 1980.12,
        change: -5.23,
        changePercent: -0.26,
        sparkline: [1995, 1990, 2000, 1985, 1982, 1980],
    },
    {
        name: "GSE-CI Target",
        value: 4500.00,
        change: 0,
        changePercent: 0,
        sparkline: [4480, 4490, 4485, 4500, 4500, 4500],
    },
];

export const mockGainers: StockMovers[] = [
    {
        symbol: "MTNGH",
        name: "MTN Ghana",
        price: 1.55,
        change: 0.05,
        changePercent: 3.33,
        sparkline: [1.45, 1.48, 1.50, 1.49, 1.52, 1.55],
    },
    {
        symbol: "GCB",
        name: "GCB Bank PLC",
        price: 3.40,
        change: 0.10,
        changePercent: 3.03,
        sparkline: [3.20, 3.25, 3.30, 3.35, 3.38, 3.40],
    },
    {
        symbol: "EGH",
        name: "Ecobank Ghana PLC",
        price: 5.50,
        change: 0.15,
        changePercent: 2.80,
        sparkline: [5.30, 5.35, 5.40, 5.42, 5.48, 5.50],
    },
];

export const mockLosers: StockMovers[] = [
    {
        symbol: "TOTAL",
        name: "TotalEnergies Mkt PLC",
        price: 9.00,
        change: -0.50,
        changePercent: -5.26,
        sparkline: [9.60, 9.50, 9.40, 9.30, 9.15, 9.00],
    },
    {
        symbol: "SCB",
        name: "Stanchart Ghana PLC",
        price: 17.50,
        change: -0.75,
        changePercent: -4.11,
        sparkline: [18.50, 18.25, 18.10, 17.90, 17.75, 17.50],
    },
    {
        symbol: "FML",
        name: "Fan Milk PLC",
        price: 3.10,
        change: -0.10,
        changePercent: -3.13,
        sparkline: [3.25, 3.20, 3.15, 3.12, 3.11, 3.10],
    },
];

export const mockActive: StockMovers[] = [
    {
        symbol: "CAL",
        name: "CalBank PLC",
        price: 0.48,
        change: 0.01,
        changePercent: 2.13,
        volume: "1.2M",
        sparkline: [0.46, 0.47, 0.47, 0.48, 0.48, 0.48],
    },
    {
        symbol: "GOIL",
        name: "GOIL PLC",
        price: 1.50,
        change: 0.00,
        changePercent: 0.00,
        volume: "850K",
        sparkline: [1.50, 1.51, 1.49, 1.50, 1.50, 1.50],
    },
    {
        symbol: "SOGEGH",
        name: "Societe Generale Gh",
        price: 1.58,
        change: -0.02,
        changePercent: -1.25,
        volume: "620K",
        sparkline: [1.60, 1.61, 1.59, 1.60, 1.59, 1.58],
    },
];
