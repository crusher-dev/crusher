export const readProjectConfig = (configPath: string) => {
    return eval("require")(configPath);
};