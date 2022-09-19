
import React, { ReactElement} from "react";
import { styled } from "@stitches/react";
import { violet, mauve } from "@radix-ui/colors";
import {
  ChevronRightIcon
} from "@radix-ui/react-icons";
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";

const contentStyles = {
  minWidth: 220,
  backgroundColor: "#0D0E0E",
  borderRadius: 12,
  overflow: "hidden",
  border: "1px solid rgba(255, 255, 255, 0.05)",
  padding: 8,
  boxShadow:
    "0px 4px 4px rgba(0, 0, 0, 0.25), 0px 0px 0px 2px rgba(0, 0, 0, 0.08)"
};

const StyledContent = styled(ContextMenuPrimitive.Content, {
  ...contentStyles
});

function Content(props) {
  return (
    <ContextMenuPrimitive.Portal>
      <StyledContent {...props} />
    </ContextMenuPrimitive.Portal>
  );
}

const StyledSubContent = styled(ContextMenuPrimitive.SubContent, {
  ...contentStyles
});

function SubContent(props) {
  return (
    <ContextMenuPrimitive.Portal>
      <StyledSubContent {...props} />
    </ContextMenuPrimitive.Portal>
  );
}

const itemStyles = {
  all: "unset",
  fontSize: 13,
  lineHeight: 1,
  color: "white",
  borderRadius: 5,
  display: "flex",
  alignItems: "center",
  height: 26,
  fontFamily: 'Gilroy, sans-serif',
  padding: "0 5px",
  position: "relative",
  paddingLeft: 8,
  userSelect: "none",

  "&[data-disabled]": {
    color: mauve.mauve8,
    pointerEvents: "none"
  },

  "&[data-highlighted]": {
    backgroundColor: "#8735D9",
    color: violet.violet1
  },
  "&[data-state=open]": {
    backgroundColor: "#8735D9",
    color: violet.violet1
  }
};

const StyledItem = styled(ContextMenuPrimitive.Item, { ...itemStyles });
const StyledCheckboxItem = styled(ContextMenuPrimitive.CheckboxItem, {
  ...itemStyles
});
const StyledRadioItem = styled(ContextMenuPrimitive.RadioItem, {
  ...itemStyles
});
const StyledSubTrigger = styled(ContextMenuPrimitive.SubTrigger, {
  '&[data-state="open"]': {
    backgroundColor: violet.violet4,
    color: violet.violet11
  },
  ...itemStyles
});

const StyledLabel = styled(ContextMenuPrimitive.Label, {
  paddingLeft: 8,
  fontSize: 12,
  lineHeight: "25px",
  color: mauve.mauve11
});

const StyledSeparator = styled(ContextMenuPrimitive.Separator, {
  height: 1,
  backgroundColor: "#2B2B2B",
  margin: 5
});

const StyledItemIndicator = styled(ContextMenuPrimitive.ItemIndicator, {
  position: "absolute",
  left: 0,
  width: 25,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center"
});


const RightSlot = styled("div", {
  marginLeft: "auto",
  paddingLeft: 20,
  color: mauve.mauve11,
  "[data-highlighted] > &": { color: "white" },
  "[data-disabled] &": { color: mauve.mauve8 }
});


const RenderMenuItems = ({menuItems,isSubItem=false})=>{
  return (menuItems.map((menuItem,i)=>{
    const {value,rightItem,disabled,subItems, onClick, type} = menuItem;

    if(type === 'separator') return (<ContextMenuSeparator />)
    if(type === 'heading') return ( <ContextMenuLabel>{value}</ContextMenuLabel>)

    if(subItems && subItems.length > 0){
      return (
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            {value} 
            <RightSlot>
                <ChevronRightIcon />
            </RightSlot>
          </ContextMenuSubTrigger>
          <ContextMenuSubContent sideOffset={2} alignOffset={-2}>
            <RenderMenuItems menuItems={subItems}/>
          </ContextMenuSubContent>
        </ContextMenuSub>
      )
    }
    return (
    <ContextMenuItem key={i} disabled={disabled} onClick={onClick}>
      {value} {rightItem ? (<RightSlot>{rightItem}</RightSlot>) : null}
    </ContextMenuItem>
    )
  }))
}

export const RightClickMenu = ({children, disabled, onOpenChange, menuItems})=>{
  if(disabled) return children;
  return (
		<ContextMenu onOpenChange={onOpenChange}>
        <ContextMenuTrigger>
        {children}
        </ContextMenuTrigger>
        <ContextMenuContent sideOffset={5} align="start">
        <RenderMenuItems menuItems={menuItems}/>
        </ContextMenuContent>
      </ContextMenu>
	)
}

type parentItem = {
  type: 'menuItem',
	value?: string,
	rightItem?: ReactElement | string,
	subMenu?: subMenuItem[],
  onClick: Function,
	disabled?: boolean
  //let it handle everything
  element?: any
}

type subMenuItem = Omit<parentItem, 'subMenu'>

type headingItem = {
	type: 'heading'
  value: string
};
type separatorItem = {
	type: 'separator'
};

type Item = separatorItem|MenuItem|headingItem

export type TRightItemProps = {
	menuItems: Item[]
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLButtonElement>, any>;




// Use to contstruct new components, if needed
// Exports
export const ContextMenu = ContextMenuPrimitive.Root;
export const ContextMenuTrigger = ContextMenuPrimitive.Trigger;
export const ContextMenuContent = Content;
export const ContextMenuItem = StyledItem;
export const ContextMenuCheckboxItem = StyledCheckboxItem;
export const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup;
export const ContextMenuRadioItem = StyledRadioItem;
export const ContextMenuItemIndicator = StyledItemIndicator;
export const ContextMenuLabel = StyledLabel;
export const ContextMenuSeparator = StyledSeparator;
export const ContextMenuSub = ContextMenuPrimitive.Sub;
export const ContextMenuSubTrigger = StyledSubTrigger;
export const ContextMenuSubContent = SubContent;
