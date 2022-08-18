#How to use?

**Wrap component**

```
	<RightClickMenu menuItems={args.menuItems}>
		<div css={boxCSS}>Click here to activate</div>
	</RightClickMenu>

```

**setMenuItems**

There are three kind of menuItems

**1. heading**
```
		{
			type: 'heading',
			value: "People"
		}
```

**2. separator**
```
		{
			type: 'separator',
		}
```


**3. separator**
```
		{
			type: 'menuItem',
			value: 'Forward',
			rightItem: <div>⌘+F</div>,
			onClick: ()=>{
				alert("Forward")
			}
		}
```

This is standard API. You can also create custom component of your own on basis of this.