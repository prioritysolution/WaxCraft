function convertToWords(num: number): string {
  if (num === 0) return "Zero";

  const units: string[] = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];

  const tens: string[] = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  const scales: string[] = ["", "Thousand", "Lakh", "Crore"];

  // Split into integer and decimal parts
  const [integerPart, decimalPart] = num.toString().split(".");

  let words = convertIntegerPartToWords(
    parseInt(integerPart, 10),
    units,
    tens,
    scales
  );

  // Handle decimal part if present
  if (decimalPart) {
    words += " Point";
    for (const digit of decimalPart) {
      words += ` ${units[parseInt(digit, 10)]}`;
    }
  }

  return words.trim();
}

function convertIntegerPartToWords(
  num: number,
  units: string[],
  tens: string[],
  scales: string[]
): string {
  let words = "";

  const crore = Math.floor(num / 10000000);
  if (crore > 0) {
    words += convertIntegerPartToWords(crore, units, tens, scales) + " Crore ";
    num %= 10000000;
  }

  const lakh = Math.floor(num / 100000);
  if (lakh > 0) {
    words += convertIntegerPartToWords(lakh, units, tens, scales) + " Lakh ";
    num %= 100000;
  }

  const thousand = Math.floor(num / 1000);
  if (thousand > 0) {
    words +=
      convertIntegerPartToWords(thousand, units, tens, scales) + " Thousand ";
    num %= 1000;
  }

  if (num > 0) {
    words += getPartInWords(num, units, tens);
  }

  return words.trim();
}

function getPartInWords(num: number, units: string[], tens: string[]): string {
  let words = "";

  if (num >= 100) {
    words += units[Math.floor(num / 100)] + " Hundred ";
    num %= 100;
  }

  if (num >= 20) {
    words += tens[Math.floor(num / 10)] + " ";
    num %= 10;
  }

  if (num > 0) {
    words += units[num] + " ";
  }

  return words.trim();
}

export default convertToWords;
