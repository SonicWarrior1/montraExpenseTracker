export const getMyColor = () => {
    let n = (Math.random() * 0xfffff * 1000000).toString(16);
    return '#' + n.slice(0, 6);
};
export const formatWithCommas = (num: string) => {
    const parts = num.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
};
export const AmountInputSetter = (str: string, setAmount: React.Dispatch<React.SetStateAction<string>>) => {
    let numericValue = str.replace(/[^0-9.]+/g, '');
    if (str === '.') {
        return;
    }
    const decimalCount = numericValue.split('.').length - 1;

    if (decimalCount > 1) {
        const parts = numericValue.split('.');
        numericValue = parts[0] + '.' + parts.slice(1).join('');
    }

    if (
        numericValue.length > 0 &&
        numericValue.endsWith('.')
    ) {
        // Allow only if it is not the only character
        if (
            numericValue.length === 1 ||
            numericValue[numericValue.length - 2] === '.'
        ) {
            numericValue = numericValue.slice(0, -1);
        }
    }

    // Limit to 2 digits after decimal point
    if (decimalCount === 1) {
        const parts = numericValue.split('.');
        if (parts[1].length > 2) {
            numericValue = parts[0] + '.' + parts[1].slice(0, 2);
        }
    }

    if (decimalCount === 1 && numericValue.length > 9) {  // Adjusted to account for the two decimal places
        numericValue = numericValue.slice(0, 10);
    } else if (decimalCount === 0 && numericValue.length > 7) {
        numericValue = numericValue.slice(0, 7);
    }

    setAmount(formatWithCommas(numericValue));

};
export const MimeToExtension: { [key: string]: string } = {
    'application/pdf': 'pdf',
    'application/msword': 'doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'text/csv': 'csv',
    'application/vnd.ms-excel': 'xls',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
    'text/plain': 'txt',
};
