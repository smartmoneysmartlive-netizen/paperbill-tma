# Paperbill Pricing & Engine Documentation

This document explains the internal logic for pricing, profit tracking, and the PAPER token discount system.

## 💰 1. Core Pricing Logic

Every transaction involves three key figures:
1. **User Price (`amount`)**: The retail price the user sees and pays.
2. **API Cost (`apiCost`)**: The internal cost Paperbill pays to the VTU provider (e.g., CheapDataHub).
3. **Profit**: Calculated as `User Price - API Cost`.

### Example (MTN 10GB Monthly):
- **User Pays**: ₦5,000
- **Paperbill Pays**: ₦4,470
- **Internal Profit**: ₦530

---

## 🪙 2. PAPER Token Discount

To encourage token usage, users receive a flat **4% discount** when they choose to "Pay with PAPER."

- **Formula**: `PAPER_Price = User_Price * 0.96`
- **Example**: A ₦1,000 data plan costs only **₦960** when paid with PAPER.

> [!NOTE]
> Even with the 4% discount, the system maintains a profit margin because the discounted price is still higher than the API cost.

---

## 🏗️ 3. Backend Implementation

### Ledger Storage
Every transaction is saved in the `Transaction` table with:
- `amount`: Final price paid by user (NGN or PAPER equivalent).
- `apiCost`: The wholesale cost for auditing.
- `currency`: Whether the user used `NGN` or `PAPER`.

### Data Categorization
Data plans are grouped into four user-facing categories to reduce "choice paralysis":
1. **Quick Data**: High-speed, short-duration daily plans.
2. **Weekly Plans**: 7-day to 14-day mid-range plans.
3. **Monthly Plans**: Core 30-day utility plans.
4. **Mega Plans**: 20GB+ heavy user bundles.

---

## 🛠️ 4. Maintenance & Admin Control
Prices and API costs are managed in `src/lib/vtu-data.ts`. This allows the "Business Person" or Admin to update margins by simply editing the mapping values without changing the core transaction engine logic.
