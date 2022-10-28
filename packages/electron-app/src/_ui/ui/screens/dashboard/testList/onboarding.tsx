import { TextBlock } from "@dyson/components/atoms";
import { css } from "@emotion/react";

export const OnboardingSection = () => {

    return (
        <div className="mt-60 m-auto">
            <div>
                <div css={onboardingSectionCSS}>
                    <div className="onboarding-item">
                        <span>get alerts</span><span className="icon">📩</span>
                    </div>
                    <div className="onboarding-item border-box">
                        <span>test on commit CI/deploy</span><span className="icon">📦</span>
                    </div>
                    <div className="onboarding-item">
                        <span>invite teams</span> <span className="icon">📟</span>
                    </div>
                </div>

                <div className="mt-20 m-auto" css={headlineBlock}>
                    <TextBlock fontSize={14} color="#7E7E7E">integrate with worfklow with clicks + also get credits</TextBlock>
                </div>
            </div>
        </div>
    )
}


const headlineBlock = css`
	width: 480rem;
`

const onboardingSectionCSS = css`

	border: 0.75px solid rgba(137, 137, 137, 0.2);
	font-size: 12px;
	border-radius: 14px;
	display: flex;
	width: fit-content;
	overflow:hidden;
	margin: 0 auto;


	.onboarding-item{
		display: flex;
		align-items: center;
		height: 40rem;
		font-size: 13.5rem;
		font-weight: 500;
		color: #E2E2E2;
		letter-spacing: .3rem;
		padding: 0 16px;

        span{   margin-top: 1rem;}

		:hover{
			background: #121212;
            span{
                text-decoration: underline;
             
            }
            .icon{
              text-decoration: unset !important;  
            }
		}

		.icon{
			margin-left: 12px;
			font-family: EmojiMart, "Segoe UI Emoji", "Segoe UI Symbol", "Segoe UI", "Apple Color Emoji", "Twemoji Mozilla", "Noto Color Emoji", "Android Emoji";
			font-size: 16rem;
		
		}
	}
	.border-box{
		border-left: 0.75px solid rgba(137, 137, 137, 0.2);
		border-right: 0.75px solid rgba(137, 137, 137, 0.2);
	}
`