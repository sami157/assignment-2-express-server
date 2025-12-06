export const calculateTotalPrice = (startDate: string, endDate: string, dailyRent: number) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const diff = end.getTime() - start.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (days <= 0) {
        throw new Error('Invalid booking period');
    }

    return days * dailyRent;
};