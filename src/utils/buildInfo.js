export const BUILD_DATE = __BUILD_DATE__;

export const formatBuildDate = (value = BUILD_DATE) => {
    const date = new Date(value);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};
