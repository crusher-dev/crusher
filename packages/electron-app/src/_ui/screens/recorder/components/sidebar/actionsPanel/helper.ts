const getItemsFromActionsData = (data: {[key: string]: string}) => {
    return Object.keys(data).map((key) => {
        return {
            id: key,
            content: data[key],
        };
    });
};

export { getItemsFromActionsData };