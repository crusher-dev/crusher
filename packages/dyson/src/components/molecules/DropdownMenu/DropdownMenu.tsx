import React, { Children, useEffect } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { styled, keyframes } from '@stitches/react';
import { violet, mauve, blackA } from '@radix-ui/colors';
import {
  DotFilledIcon,
  CheckIcon,
  ChevronRightIcon,
} from '@radix-ui/react-icons';
import { contentStyles, itemStyles } from '../RightClick/RightClick';

const RenderMenuItems = ({ menuItems=[], isSubItem = false }) => {

  return menuItems.map((menuItem, i) => {
    const { value, rightItem=false, disabled=false, subItems, onClick, type } = menuItem;

    if (type === 'separator') return (<DropdownMenuSeparator />)
    if (type === 'heading') return (<DropdownMenuLabel>{value}</DropdownMenuLabel>)


    if (subItems && subItems.length > 0) {
      return (
        <DropdownMenu.Sub>
          <DropdownMenuSubTrigger>
            {value}
            <RightSlot>
              <ChevronRightIcon />
            </RightSlot>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent sideOffset={2} alignOffset={-2}>
            <RenderMenuItems menuItems={subItems} />
          </DropdownMenuSubContent>
        </DropdownMenu.Sub>
      )
    }
    return (
      <DropdownMenuItem key={i} disabled={disabled} onClick={onClick}>
        {value} {rightItem ? (<RightSlot>{rightItem}</RightSlot>) : null}
      </DropdownMenuItem>
    )
  }
  )
}


export const DropdownMenuBox = (props) => {
  const {children,menuItems} = props;
 
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
       {children}
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenuContent sideOffset={5}>
        <RenderMenuItems menuItems={menuItems}/>
          <DropdownMenuArrow />
        </DropdownMenuContent>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};



const DropdownMenuContent = styled(DropdownMenu.Content, contentStyles);
const DropdownMenuSubContent = styled(DropdownMenu.SubContent, contentStyles);
const DropdownMenuArrow = styled(DropdownMenu.Arrow, { fill: '#2B2B2B' });

const DropdownMenuItem = styled(DropdownMenu.Item, itemStyles);
const DropdownMenuSubTrigger = styled(DropdownMenu.SubTrigger, {
  '&[data-state="open"]': {
    backgroundColor: violet.violet4,
    color: violet.violet11,
  },
  ...itemStyles,
});

const DropdownMenuLabel = styled(DropdownMenu.Label, {
  paddingLeft: 8,
  fontSize: 13,
  lineHeight: '25px',
  color: mauve.mauve11,
});

const DropdownMenuSeparator = styled(DropdownMenu.Separator, {
  height: 1,
  backgroundColor: "#2B2B2B",
  margin: 5,
});



const RightSlot = styled('div', {
  marginLeft: 'auto',
  paddingLeft: 20,
  color: mauve.mauve11,
  '[data-highlighted] > &': { color: 'white' },
  '[data-disabled] &': { color: mauve.mauve8 },
});


export default DropdownMenu;
