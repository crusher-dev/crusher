import { css } from "@emotion/react";
import { Heading } from "dyson/src/components/atoms/heading/Heading";
import { TextBlock } from "dyson/src/components/atoms/textBlock/TextBlock";
import { Text } from "dyson/src/components/atoms/text/Text";
import { Button } from "dyson/src/components/atoms";
import { Input } from "dyson/src/components/atoms";


export default function Learn() {
    return (
        <div
            css={css(`
				height: 100vh;
				background: #08090b;
				width: 100vw;
			`)}
        >
            <div className={"flex justify-center"}>
                <div className={"mt-84 flex flex-col items-center"}>
                    <Heading type={1} fontSize={18}>
                        Learn how Crusher works in 60 seconds
                    </Heading>
                    <TextBlock fontSize={14.2} color={"#E7E7E7"} className={"mt-12"} leading={false}>
                        Don't worry, this usually takes 2-3 mins
                    </TextBlock>

                    <div css={overlayContainer} className={"flex mt-36"}>
                        <div className="flex flex-1">Hey
                            <Text>
                                Hey
                            </Text>
                        </div>
                        <div css={css`border-left:1px solid #21252f`} className="flex flex-1">Hey
                            <Text>
                                Hey
                            </Text>
                        </div>
                    </div>
                    <div className="mt-40">
                        <Button
                            // bgColor={"tertiary-dark"}
                            className={"flex items-center justify-center mt-30"}
                            css={css(`
									width: 180rem;
									height: 36rem;
									font-weight: 400;
                                    background:#905CFF;
								`)}
                        >
                            <Text className={"ml-10"} fontSize={14} weight={900}>
                                Open dashboard
                            </Text>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

const overlayContainer = css(`
	background: #0a0b0c;
	border: 1px solid #21252f;
	border-radius: 10px;
	width: 800rem;
	min-height: 200px;
`);
