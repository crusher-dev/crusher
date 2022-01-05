import { css } from "@emotion/react";
import { Heading } from "dyson/src/components/atoms/heading/Heading";
import { TextBlock } from "dyson/src/components/atoms/textBlock/TextBlock";
import { Text } from "dyson/src/components/atoms/text/Text";
import { Button } from "dyson/src/components/atoms";
import { Input } from "dyson/src/components/atoms";

const RocketImage = (props) => (
    <img
        {...props}
        src={
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAPCAYAAADUFP50AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJBSURBVHgBndJNSJNxHAfw77ZnPcu5Cb4u3yrnzMhMxQyLOnRQC0yJ9NBFSjHo0k0yIuhSmNClCJUOlpGHDpUkmka+5NSp0Wh7Njc3n/a4ILH26rO5t+efGXWaFX3P38/l9/sC/xnRvxbbOjoUyozy0kBUdCzgX3/9V9ja2io9W3O63UsltLz3yXNo1T4YtLN2yZ/QpE5XQDPWye4nTxvSx0aTKpvqUZgFvJxiV8Tbob6+vqP+Ce1Cz9R04QTzEYrkJBTlZcPD2uCxvhuNCzuLy07yGQf651b9ijO8F90aDaovNcNiYTA8NBxJ8OsfUb/KvkzVBXg8u1YIUfXmV1weN/ISWXoxGrtO4KA6G1bWjumpGTCmpTsL49PGLejLT2umvb6H4dgGFiHFiFiFRD6II0UliAoGmPVa6BkOM7Pz8zYHe/eHocj1HHXYFeykXCFwTnhGuBTZ3pIymWZ3Eg6/7cVAmMYnrxMSj8PImJfrvjrMri0YruDvUztiYmGN/nazJ/Mqu7/03vHEIJTd7eiXZ2FOkIOsfXnBuwwXvRzn/n0IQn6OgHt8qNphqmXPN9WRc8oE0pWbFm1JySODO5XLDUD8t324hhKBq4qG3LfJgwY1GaqRDeoU1PNVMYhbhFfxjJhszk5TntojUsoldt1nVJ4SZnJpLKjFsXp6syCIYI8LLbXYI9kIFkUYW1SJgbGlIbaqIC8clCrIegS4kSLgSjxI8RlIhlR0yzW2+IaxRAyNz8C726SmQGqoJssJLbbJd0nz9aMpv90CAAAAAElFTkSuQmCC"
        }
    />
);


export default function Signup() {
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
                        Ready to ship faster & better  <RocketImage className={"ml-8"} />
                    </Heading>
                    <TextBlock fontSize={14.2} color={"#E7E7E7"} className={"mt-12"} leading={false}>
                        Million of devs empower their workflow with crusher
                    </TextBlock>

                    <div css={overlayContainer} className={"mt-36 pt-36 pl-32 pr-32"}>
                        <TextBlock fontSize={14} color={"#E7E7E7"} className={"mb-24"}>
                            Reset your password
                        </TextBlock>

                        <div className={" mb-72"}>
                            <div className="mt-20">
                                <Input className='md-20 bg' placeholder='Enter Name' />
                            </div>
                            <Button
                                className={"flex items-center justify-center mt-30"}
                                css={css(`
									width: 100%;
									height: 38px;
									font-weight: 400;
                                    background:#905CFF;

								`)}
                            >
                                <Text className={"ml-10"} fontSize={14} weight={900}>
                                    Send reset password link
                                </Text>
                            </Button>
                        </div>
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
	width: 400rem;
	min-height: 200px;
`);
