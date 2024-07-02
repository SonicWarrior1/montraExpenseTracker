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

    // Limit to 1 digit after decimal point
    if (decimalCount === 1) {
        const parts = numericValue.split('.');
        if (parts[1].length > 1) {
            numericValue = parts[0] + '.' + parts[1].slice(0, 1);
        }
    }

    if (decimalCount === 1 && numericValue.length > 8) {
        numericValue = numericValue.slice(0, 8);
    } else if (decimalCount === 0 && numericValue.length > 7) {
        numericValue = numericValue.slice(0, 7);
    }

    setAmount(formatWithCommas(numericValue));
}