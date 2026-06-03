
export class PriceUtils {
  /**
   * Converts a price string such as "$29.99" or "$1,299.99"
   * into a number.
   */
  static parsePrice(priceText: string | null | undefined): number {
    if (!priceText) {
      throw new Error("Price text is empty or undefined.");
    }

    const value = parseFloat(
      priceText.replace(/[^0-9.-]/g, "")
    );

    if (Number.isNaN(value)) {
      throw new Error(`Unable to parse price: ${priceText}`);
    }

    return value;
  }
}
