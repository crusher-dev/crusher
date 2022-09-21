import { Global, css } from "@emotion/react";
import React from "react";
import Picker from '@emoji-mart/react'
import { HoverCard } from "dyson/src/components/atoms/tooltip/Tooltip1";



const EmojiPicker = ({onEmojiSelected, children, isOpen, ...props}) => {
    const [show, setShow] = React.useState(false);

    const handleEmojiSelect = (emoji) => {
        setShow(false);
        console.log("Selected emoji is", emoji);
    };
    const onStateChange = (isShowing) => {
        setShow(isShowing);
    }

    const dropdown = (
        <Picker
            onEmojiSelect={handleEmojiSelect}
            previewPosition={'none'}
            // searchPosition={'none'}
            skinTonePosition={'none'}
            perLine={8}
            emojiSize={16}
            emojiButtonSize={30}
            noCountryFlags={true}
        />
    );
    return (
        <>
            <HoverCard state={show} callback={onStateChange} css={userDropdownCSS} content={dropdown} placement="right" type="click" padding={2} offset={0}>
                {children}
            </HoverCard>
            <Global styles={globalCss}/>
        </>
    )
}

const globalCss = css`
  em-emoji-picker {
    --background-rgb: #101010;
    font-family: 'Gilroy', 'sans-serif';
    --font-size: 12px;
    --border-radius: 20px;
    --category-icon-size: 14px;
    --color-border-over: rgba(0, 0, 0, 0.1);
    --color-border: rgb(61 61 61 / 30%);
  
    --rgb-accent: 233, 96, 255;
    --rgb-background: 0, 0, 0;
    --rgb-color: 255, 255, 255;
    --rgb-input: 255, 235, 235;
  
    border: 1px solid #202020;
    min-height: 260px;
    max-height: 260px;
  }
`;

const userDropdownCSS = css`
    padding: 0 !important;
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
    margin-left: 4rem !important;
`
export { EmojiPicker };