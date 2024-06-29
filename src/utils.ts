export function calculatePriceChangesbuy(price: number) {
  const dollarDecreases = Array.from({ length: 18 }, (_, i) => i + 1);
  const priceChanges: { [key: string]: string } = {};
  dollarDecreases.forEach((decrease) => {
    const changeKey = `minus_${decrease}_dollar`;
    priceChanges[changeKey] = (price - decrease).toFixed(2);
  });

  return priceChanges;
}

export function calculatePriceChangesSell(price: number) {
  const dollarIncreases = Array.from({ length: 18 }, (_, i) => i + 1);
  const priceChanges: { [key: string]: string } = {};
  dollarIncreases.forEach((increase) => {
    const changeKey = `plus_${increase}_dollar`;
    priceChanges[changeKey] = (price + increase).toFixed(2);
  });

  return priceChanges;
}
