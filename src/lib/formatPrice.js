export function formatPrice(value) {
  if (value === null || value === undefined || value === "") {
    return "On Request";
  }

  const amount = Number(value);

  if (Number.isNaN(amount)) {
    return "On Request";
  }

  return `₦${amount.toLocaleString("en-NG")}`;
}
