const formatPrice = (price: number | undefined) => {
  if (!price) {
    return '';
  }

  const stringPrice = new Intl.NumberFormat('fa-IR').format(price);

  return `${stringPrice} ریال`;
};

export default formatPrice;
