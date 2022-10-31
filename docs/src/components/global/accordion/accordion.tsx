import React from 'react';
import { styled, keyframes } from '@stitches/react';
import { violet, blackA, mauve, mauveDark, greenDark, grayDark, whiteA } from '@radix-ui/colors';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { VercelIntegrationButton } from '../buttons/vercel.button';

const slideDown = keyframes({
  from: { height: 0 },
  to: { height: 'var(--radix-accordion-content-height)' },
});

const slideUp = keyframes({
  from: { height: 'var(--radix-accordion-content-height)' },
  to: { height: 0 },
});

const StyledAccordion = styled(AccordionPrimitive.Root, {
  borderRadius: 10,
  width: "100%",
  border: "1px solid rgba(255, 255, 255, 0.10)",
});

const StyledItem = styled(AccordionPrimitive.Item, {
  overflow: 'hidden',
  marginTop: 0,

  borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
  '&:first-child': {
    marginTop: 0,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },

  '&:last-child': {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderBottom: "0px solid rgba(255, 255, 255, 0.06)",
  },

  '&:focus-within': {
    position: 'relative',
    zIndex: 1,

  },
});

const StyledHeader = styled(AccordionPrimitive.Header, {
  all: 'unset',
  display: 'flex',
  background: "#121212",
  fontFamily: "Ubuntu",
  fontWeight: 700,
  borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
  fontSize: 18

});

const StyledTrigger = styled(AccordionPrimitive.Trigger, {
  all: 'unset',
  fontFamily: 'inherit',
  backgroundColor: 'transparent',

  padding: '0 24px',
  height: 56,
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  fontSize: 15,
  lineHeight: 1,
  color: "#d9d8d8",

  overflow: "hidden",
  cursor: "pointer",
  '&[data-state="closed"]': { backgroundColor: "#121212" },
  '&[data-state="open"]': { backgroundColor: "transparent" },
  '&:hover': { backgroundColor: "#121212" },
});

const StyledContent = styled(AccordionPrimitive.Content, {
  overflow: 'hidden',
  fontSize: 15,
  fontFamily: "Gilroy",

  backgroundColor: "#0b0b0b",

  '&[data-state="open"]': {
    animation: `${slideDown} 300ms cubic-bezier(0.87, 0, 0.13, 1)`,
  },
  '&[data-state="closed"]': {
    animation: `${slideUp} 300ms cubic-bezier(0.87, 0, 0.13, 1)`,
  },
});

const StyledContentText = styled('div', {
  padding: '24px 32px',
});

const StyledChevron = styled(ChevronDownIcon, {
  color: whiteA.whiteA9,
  transition: 'transform 300ms cubic-bezier(0.87, 0, 0.13, 1)',
  '[data-state=open] &': { transform: 'rotate(180deg)' },
});

// Exports
export const Accordion = StyledAccordion;
export const AccordionItem = StyledItem;
export const AccordionTrigger = React.forwardRef(({ children, ...props }, forwardedRef) => (
  <StyledHeader>
    <StyledTrigger {...props} ref={forwardedRef}>
      {children}
      <StyledChevron aria-hidden />
    </StyledTrigger>
  </StyledHeader>
));
export const AccordionContent = React.forwardRef(({ children, ...props }, forwardedRef) => (
  <StyledContent {...props} ref={forwardedRef}>
    <StyledContentText>{children}</StyledContentText>
  </StyledContent>
));

// Your app...
export const AccordionDemo = () => {
  const [value, setvalue] = React.useState(["item-1"]);
  return (
    <Accordion type="multiple" defaultValue={"item-1"} value={value} onValueChange={(val) => setvalue(val)} collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger> 1.  🚀 &nbsp;Add Crusher integration on vercel</AccordionTrigger>
        <AccordionContent>
          <div style={{ lineHeight: 1.5 }}>Setup vercel integration with a single click.</div><br />
          Open <a style={{ lineHeight: 1.5, marginBottom: 20, color: "#2ea6ff" }} href="https://vercel.com/integrations/crusher-dev">https://vercel.com/integrations/crusher-dev</a><br /><br />
          <VercelIntegrationButton />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-2">
        <AccordionTrigger>2. Link github repo on Crusher</AccordionTrigger>
        <AccordionContent>
          <li>Go to Project settings -> Integration</li>
          <li>Click connect in github integration</li>
          <img src="https://i.imgur.com/MxcfD6R.png" />
          <li>Select your github repo</li>
        </AccordionContent>
      </AccordionItem>


    </Accordion>
  );
}
