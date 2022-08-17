
import React, { ReactElement} from "react";
import { styled } from "@stitches/react";
import { violet, mauve } from "@radix-ui/colors";
import {
  DotFilledIcon,
  CheckIcon,
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


const RightSlot = styled("div", {
  marginLeft: "auto",
  paddingLeft: 20,
  color: mauve.mauve11,
  "[data-highlighted] > &": { color: "white" },
  "[data-disabled] &": { color: mauve.mauve8 }
});


export const RightClickMenu = ({children})=>{
	const [bookmarksChecked, setBookmarksChecked] = React.useState(true);
	const [urlsChecked, setUrlsChecked] = React.useState(false);
	const [person, setPerson] = React.useState("pedro");
	return (
		<ContextMenu>
			<ContextMenuTrigger>
			{children}
			</ContextMenuTrigger>
        <ContextMenuContent sideOffset={5} align="start">
			<StyledCheckboxItem>
			Back <RightSlot>⌘+[</RightSlot>
			</StyledCheckboxItem>

			<StyledCheckboxItem>
			Back <RightSlot>⌘+[</RightSlot>
			</StyledCheckboxItem>

			<StyledCheckboxItem>
			Back <RightSlot>⌘+[</RightSlot>
			</StyledCheckboxItem>

          <ContextMenuItem>
            Back <RightSlot>⌘+[</RightSlot>
          </ContextMenuItem>
          <ContextMenuItem disabled>
            Foward <RightSlot>⌘+]</RightSlot>
          </ContextMenuItem>
          <ContextMenuItem>
            Reload <RightSlot>⌘+R</RightSlot>
          </ContextMenuItem>
          <ContextMenuSub>
            <ContextMenuSubTrigger>
              More Tools
              <RightSlot>
                <ChevronRightIcon />
              </RightSlot>
            </ContextMenuSubTrigger>
            <ContextMenuSubContent sideOffset={2} alignOffset={-2}>
              <ContextMenuItem>
                Save Page As… <RightSlot>⌘+S</RightSlot>
              </ContextMenuItem>
              <ContextMenuItem>Create Shortcut…</ContextMenuItem>
              <ContextMenuItem>Name Window…</ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem>Developer Tools</ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
          <ContextMenuSeparator />
          <ContextMenuCheckboxItem
            checked={bookmarksChecked}
            onCheckedChange={setBookmarksChecked}
          >
            Show Bookmarks <RightSlot>⌘+B</RightSlot>
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem
            checked={urlsChecked}
            onCheckedChange={setUrlsChecked}
          >
            <ContextMenuItemIndicator>
              <CheckIcon />
            </ContextMenuItemIndicator>
            Show Full URLs
          </ContextMenuCheckboxItem>
          <ContextMenuSeparator />
          <ContextMenuLabel>People</ContextMenuLabel>
          <ContextMenuRadioGroup value={person} onValueChange={setPerson}>
            <ContextMenuRadioItem value="pedro">
              Pedro Duarte
            </ContextMenuRadioItem>
            <ContextMenuRadioItem value="colm">
              <ContextMenuItemIndicator>
                <DotFilledIcon />
              </ContextMenuItemIndicator>
              Colm Tuite
            </ContextMenuRadioItem>
          </ContextMenuRadioGroup>
        </ContextMenuContent>
      </ContextMenu>
	)
}

type subMenuItem = {
	value?: string,
	rightItem?: string,
	disabled?: boolean
}

type Item = {
	value?: string,
	rightItem?: string,
	subMenu?: subMenuItem[],
	disabled?: boolean
}

type heading = {
	headingName: string
};
type highlight = {
	hightlight: true
};

export type TSelectBoxProps = {
	menuItems: highlight|Item|heading[]
} & React.DetailedHTMLProps<React.HTMLAttributes<HTMLButtonElement>, any>;

const SelectDefaultProps = {
	disabled: false,
	value: 'test',

};

export const SelectBox: React.FC<TSelectBoxProps> = ({}) => {
	return (
		<div>dsf</div>
	);
};



SelectBox.defaultProps = SelectDefaultProps;
