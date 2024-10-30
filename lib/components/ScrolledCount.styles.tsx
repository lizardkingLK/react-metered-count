export const containerStyles: (size: number) => React.CSSProperties = (
  size: number
) => ({
  placeSelf: "center",
  overflowY: "hidden",
  height: size,
});

export const itemStyles = (size: number) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontFamily: "'Roboto Mono', sans-serif",
  width: size,
  height: size,
  fontSize: size,
});

export const separatorStyles = (size: number) => ({
  fontSize: size,
});
