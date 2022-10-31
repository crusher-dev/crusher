import React from "react";
import { styled, keyframes } from "@stitches/react";
import { blackA, mauve } from "@radix-ui/colors";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import * as AccordionPrimitive from "@radix-ui/react-accordion";

const slideDown = keyframes({
    from: { height: 0 },
    to: { height: "var(--radix-accordion-content-height)" }
});

const slideUp = keyframes({
    from: { height: "var(--radix-accordion-content-height)" },
    to: { height: 0 }
});

const StyledAccordion = styled(AccordionPrimitive.Root, {
    borderRadius: 12,
    width: "100%",

    overflow: "hidden",
    border: "1px solid #1E1F1F",
    boxShadow: `0 2px 10px ${blackA.blackA4}`
});

const StyledItem = styled(AccordionPrimitive.Item, {
    overflow: "hidden",
    marginTop: 1,

    "&:first-child": {
        marginTop: 0,
        borderTopLeftRadius: 4,
        borderTopRightRadius: 4
    },

    "&:last-child": {
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4
    },

    "&:focus-within": {
        position: "relative",
        zIndex: 1,
        boxShadow: `0 0 0 2px ${mauve.mauve12}`
    }
});

const StyledHeader = styled(AccordionPrimitive.Header, {
    all: "unset",
    display: "flex"
});

const StyledTrigger = styled(AccordionPrimitive.Trigger, {
    all: "unset",
    backgroundColor: "transparent",
    padding: "0 20px",
    height: 45,
    fontFamily: "Cera Pro",
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: 15,
    fontWeight: 500,
    lineHeight: 1,
    color: "#949494",
    '&[data-state="closed"]': { backgroundColor: "#0B0B0B" },
    '&[data-state="open"]': {
        backgroundColor: "#0B0B0B",
        borderBottom: "1px solid #1E1F1F"
    },
    "&:hover": { backgroundColor: "#191919" }
});

const StyledContent = styled(AccordionPrimitive.Content, {
    overflow: "hidden",
    fontSize: 14,
    color: "#949494",
    fontFamily: "Gilroy",
    backgroundColor: "#0B0B0B",
    lineHeight: "29px",

    '&[data-state="open"]': {
        animation: `${slideDown} 300ms cubic-bezier(0.87, 0, 0.13, 1)`
    },
    '&[data-state="closed"]': {
        animation: `${slideUp} 300ms cubic-bezier(0.87, 0, 0.13, 1)`
    }
});

const StyledContentText = styled("div", {
    padding: "15px 20px"
});

const StyledChevron = styled(ChevronDownIcon, {
    color: "#AE46FF",
    transition: "transform 300ms cubic-bezier(0.87, 0, 0.13, 1)",
    "[data-state=open] &": { transform: "rotate(180deg)" }
});

// Exports
export const Accordion = StyledAccordion;
export const AccordionItem = StyledItem;
export const AccordionTrigger = React.forwardRef(
    ({ children, ...props }, forwardedRef) => (
        <StyledHeader>
            <StyledTrigger {...props} ref={forwardedRef}>
                {children}
                <StyledChevron aria-hidden />
            </StyledTrigger>
        </StyledHeader>
    )
);
export const AccordionContent = React.forwardRef(
    ({ children, ...props }, forwardedRef) => (
        <StyledContent {...props} ref={forwardedRef}>
            <StyledContentText>{children}</StyledContentText>
        </StyledContent>
    )
);

export const AccordionDemo = ({ question, children, open = true }) => (
    <Accordion type="single" defaultValue={"item-1"} collapsible>
        <AccordionItem value="item-1">
            <AccordionTrigger>{question}</AccordionTrigger>
            <AccordionContent>
                {children}
            </AccordionContent>
        </AccordionItem>
    </Accordion>
);

export default AccordionDemo;
