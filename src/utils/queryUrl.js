export const currentUrlQuery = (query) => {
    const queryUrl = new URLSearchParams(window.location.search);
    return queryUrl.get(query);
};