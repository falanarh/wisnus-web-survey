export const replacePlaceholders = (
    input: string,
    replacements: Record<string, string>
): string => {
    let replaced = input;
    let hasReplacement = false;

    for (const key in replacements) {
        const regex = new RegExp(`\\{\\$${key}\\}`, 'g');
        if (regex.test(replaced)) {
            hasReplacement = true;
            replaced = replaced.replace(regex, replacements[key]);
        }
    }

    return hasReplacement ? replaced : input;
};

export const getCurrentMonthYear = (): string => {
    const date = new Date();
    const monthNames = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    return `${month} ${year}`;
};