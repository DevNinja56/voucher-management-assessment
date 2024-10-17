export const calculateDiscount = (
  discountType: string,
  discountValue: number,
  amount: number
) => {
  return discountType === "percentage"
    ? amount * (discountValue / 100)
    : discountValue;
};
