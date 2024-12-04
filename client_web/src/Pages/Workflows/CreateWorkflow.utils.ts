export const normalizeName = (name: string): string => {
    return name.replace(/_/g, " ").replace(/\b\w/g, (c: string): string => c.toUpperCase());
};
