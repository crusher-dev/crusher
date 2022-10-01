import React from "react";
import { styled, keyframes } from "@stitches/react";
import { blackA, mauve, green, red, whiteA } from "@radix-ui/colors";
import { Cross2Icon } from "@radix-ui/react-icons";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { TextBlock } from "../atoms";
import { Heading } from "../atoms/heading/Heading";

const overlayShow = keyframes({
    "0%": { opacity: 0 },
    "100%": { opacity: 1 }
});

const contentShow = keyframes({
    "0%": { opacity: 0, transform: "translate(-50%, -48%) scale(.96)" },
    "100%": { opacity: 1, transform: "translate(-50%, -50%) scale(1)" }
});

const StyledOverlay = styled(DialogPrimitive.Overlay, {
    backgroundColor: blackA.blackA9,
    position: "fixed",
    inset: 0,
    "@media (prefers-reduced-motion: no-preference)": {
        animation: `${overlayShow} 70ms cubic-bezier(0.16, 1, 0.3, 1)`
    }
});

const StyledContent = styled(DialogPrimitive.Content, {
    backgroundColor: "#0D0E0E",
    marginTop: -100,
    color: "#fff",
    border: ".5px solid rgb(179 179 179 / 10%);",
    boxShadow:
        "hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px",
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90vw",
    maxWidth: "450px",
    maxHeight: "85vh",
    borderRadius: 16,
    padding: 25,
    "@media (prefers-reduced-motion: no-preference)": {
        animation: `${contentShow} 70ms cubic-bezier(0.16, 1, 0.3, 1)`
    },
    "&:focus": { outline: "none" }
});

function Content({ children, ...props }) {
    return (
        <DialogPrimitive.Portal>
            <StyledOverlay />
            <StyledContent {...props}>{children}</StyledContent>
        </DialogPrimitive.Portal>
    );
}

// Exports
export const Dialog = DialogPrimitive.Root;
export const DialogContent = Content;
export const DialogClose = DialogPrimitive.Close;

// Your app...
const Flex = styled("div", { display: "flex" });

const Button = styled("button", {
    all: "unset",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    padding: "0 15px",
    fontSize: 15,
    lineHeight: 1,
    fontWeight: 500,
    height: 35,

    variants: {
        variant: {
            violet: {
                backgroundColor: "#0D0E0E",
                color: "#fff",
                border: " 0.5px solid rgba(61, 61, 62, 0.4)",
                "&:hover": { opacity: ".8" }
            },
            green: {
                backgroundColor: green.green4,
                color: green.green11,
                "&:hover": { backgroundColor: green.green5 },
                "&:focus": { boxShadow: `0 0 0 2px ${green.green7}` }
            },
            grey: {
                backgroundColor: "#101010",
                color: "#8A8A8A",
                border: "0.5px solid rgba(94, 94, 94, 0.16)",
                "&:hover": { filter: "brightness(125%)" }
            },
            red: {
                backgroundColor: red.red4,
                color: red.red11,
                marginLeft: 12,
                "&:hover": { filter: "brightness(75%)" },
                "&:focus": { boxShadow: `0 0 0 2px ${red.red7}` }
            }
        }
    },

    defaultVariants: {
        variant: "violet"
    }
});

const IconButton = styled("button", {
    all: "unset",
    fontFamily: "inherit",
    borderRadius: "100%",
    height: 25,
    width: 25,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    color: whiteA.whiteA10,
    position: "absolute",
    top: 12,
    right: 12,

    "&:hover": { color: whiteA.whiteA10 }
});

const ConfirmDialog = ({
    open = true,
    onOpenChange = () => { },
    onAcceptClick = () => { },
    onReject = () => { }
}) => (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
            <Heading fontSize={15}>Are you sure you want to go back?</Heading>
            <TextBlock fontSize={14} color="#454545" className="mt-12">You'll lose all the actions</TextBlock>
            <Flex css={{ marginTop: 25, justifyContent: "flex-end" }}>
                <DialogClose asChild>
                    <div>
                        <Button variant="grey" onClick={onReject}>No</Button>
                        <Button variant="red" onClick={onAcceptClick}>Go back</Button>
                    </div>
                </DialogClose>
            </Flex>
            <DialogClose asChild>
                <IconButton aria-label="Close">
                    <Cross2Icon />
                </IconButton>
            </DialogClose>
        </DialogContent>
    </Dialog>
);

export default ConfirmDialog;
