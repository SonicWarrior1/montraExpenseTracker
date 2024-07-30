export const getMyColor = () => {
  let n = (Math.random() * 0xfffff * 1000000).toString(16);
  return '#' + n.slice(0, 6);
};
export const formatWithCommas = (num: string) => {
  const parts = num.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
};
const getMaxLengths = (isEdit: boolean, editAmt?: string) => {
  const parts = editAmt!.replace(/[^0-9.]+/g, '').split('.');
  if (isEdit && parts[0].length > 7) {
    return {
      beforeDecimal: parts[0].length,
      afterDecimal: 2,
    };
  }
  return {
    beforeDecimal: 7,
    afterDecimal: 2,
  };
};

export const AmountInputSetter = (
  str: string,
  setAmount: React.Dispatch<React.SetStateAction<string>>,
  isEdit: boolean,
  editAmt?: string,
) => {
  const {beforeDecimal, afterDecimal} = getMaxLengths(isEdit, editAmt);
  let numericValue = str.replace(/[^0-9.]+/g, '');
  if (str === '.') {
    return;
  }
  const decimalCount = numericValue.split('.').length - 1;

  if (decimalCount > 1) {
    const parts = numericValue.split('.');
    numericValue = `${parts[0]}.${parts.slice(1).join('')}`;
  }

  if (numericValue.length > 0 && numericValue.endsWith('.')) {
    if (
      numericValue.length === 1 ||
      numericValue[numericValue.length - 2] === '.'
    ) {
      numericValue = numericValue.slice(0, -1);
    }
  }

  if (decimalCount === 1) {
    const parts = numericValue.split('.');
    if (parts[1].length > afterDecimal) {
      numericValue = `${parts[0]}.${parts[1].slice(0, afterDecimal)}`;
    }
  }

  const beforeDecimalPart = numericValue.split('.')[0];
  if (beforeDecimalPart.length > beforeDecimal) {
    const parts = numericValue.split('.');
    numericValue = parts[0].slice(0, beforeDecimal);
    if (parts[1]) {
      numericValue += `.${parts[1].slice(0, afterDecimal)}`;
    }
  }

  setAmount(formatWithCommas(numericValue));
};
export const MimeToExtension: {[key: string]: string} = {
  'application/pdf': 'pdf',
  'application/msword': 'doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
    'docx',
  'text/csv': 'csv',
  'application/vnd.ms-excel': 'xls',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  'text/plain': 'txt',
};
