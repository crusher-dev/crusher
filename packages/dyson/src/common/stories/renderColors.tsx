import { colors } from "../../constant/color";
import { css } from "@emotion/react";
export const RenderColors = () => {
	return (
		<div>
			{Object.entries(colors).map(([colorsType, values]) => {
				return (
					<div
						css={css`
							color: #fff;
							font-size: 18px;
							font-weight: 600;
							margin-top: 20px;
						`}
					>
						{colorsType}

						<div
							css={css`
								margin-bottom: 40px;
								display: flex;
							`}
						>
							{Object.entries(values)
								.sort(([color1], [color2]) => color2 - color1)
								.map(([color, hexcode]) => (
									<div
										css={css`
											height: 140px;
											width: 140px;
											background: ${hexcode};

											margin-top: 40px;
											margin-right: 40px;
											display: flex;
											justify-content: center;
											align-items: center;
											font-size: 12px;
											border-radius: 4px;
											text-align: center;
										`}
										onClick={() => {
											const value = `COLOR.${colorsType}.${color}`;
											const cb = navigator.clipboard;
											cb.writeText(value).then(() => alert(`Copied - ${value}`));
										}}
									>
										{hexcode}
										<br />
										{`COLOR.${colorsType}.${color}`}
									</div>
								))}
						</div>
					</div>
				);
			})}
		</div>
	);
};
export default RenderColors;
