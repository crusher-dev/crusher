import React from "react";
import styled from "styled-components";

const GridWrapper = styled.div`
	align-items: center;
	display: flex;
	justify-content: center;
`;

const GridImages = styled.div`
	box-sizing: border-box;
	color: #444;
	display: grid;
	grid-gap: 30px;
	grid-template-columns: repeat(1, 1fr);
	padding: 30px;
	width: 100%;

	@media (min-width: 1024px) {
		grid-template-columns: repeat(3, 1fr);
	}
`;

const ImgWrapper = styled.div`
	background-color: #f3c98b;
	padding-bottom: calc(100% / 1.5);
	position: relative;
	width: 300px;
`;

const Img = styled.img`
	left: 0;
	max-width: 100%;
	position: absolute;
	top: 0;
`;

export default function Grid() {
	return (
		<GridWrapper>
			<GridImages className="image-grid">
				<ImgWrapper>
					<Img src="https://placeimg.com/1024/683/any/grayscale?1" alt="1" />
				</ImgWrapper>
				<ImgWrapper>
					<Img src="https://placeimg.com/1024/683/any/grayscale?2" alt="2" />
				</ImgWrapper>
				<ImgWrapper>
					<Img src="https://placeimg.com/1024/683/any/grayscale?3" alt="3" />
				</ImgWrapper>
				<ImgWrapper>
					<Img src="https://placeimg.com/1024/683/any/grayscale?4" alt="4" />
				</ImgWrapper>
				<ImgWrapper>
					<Img src="https://placeimg.com/1024/683/any/grayscale?5" alt="5" />
				</ImgWrapper>
				<ImgWrapper>
					<Img src="https://placeimg.com/1024/683/any/grayscale?6" alt="6" />
				</ImgWrapper>
			</GridImages>
		</GridWrapper>
	);
}
