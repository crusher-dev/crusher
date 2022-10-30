export function trimMultiLineString(string) {
    return string.split("\n").map((string) => string.trim()).join("\n")
}