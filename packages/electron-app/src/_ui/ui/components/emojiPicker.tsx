import { Global, css } from "@emotion/react";
import React from "react";
import Picker from '@emoji-mart/react'
import { HoverCard } from "@dyson/components/atoms/tooltip/Tooltip1";



const EmojiPicker = ({
    onEmojiSelected,
    children
}) => {
    const [show, setShow] = React.useState(false);

    const handleEmojiSelect = React.useCallback((emoji) => {
        setShow(false);
        if (onEmojiSelected) {
            onEmojiSelected(emoji);
        }
    }, [onEmojiSelected]);
    const onStateChange = (isShowing) => {
        setShow(isShowing);
    }

    const dropdown = (
        <div onClick={(e) => e.preventDefault() || e.stopPropagation()}>
  <Picker
            onEmojiSelect={handleEmojiSelect}
            previewPosition={'none'}
            searchPosition={'none'}
            // skinTonePosition={'none'}
            // perLine={8}
            // emojiSize={16}
            // emojiButtonSize={30}
            // noCountryFlags={true}
            skinTonePosition={'none'}
            perLine={10}
            emojiSize={16}
            emojiButtonSize={30}
            noCountryFlags={true}
            theme={"dark"}
        />
        </div>
    );

    return (
        <>
            <HoverCard state={show} callback={onStateChange} css={userDropdownCSS} content={dropdown} placement="right" type="click" padding={2} offset={0}>
                {children}
            </HoverCard>
            <Global styles={globalCss} />
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
    min-height: 240px;
    max-height: 300px;

    input:focus{
        background-color: transparent !important;
    }
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