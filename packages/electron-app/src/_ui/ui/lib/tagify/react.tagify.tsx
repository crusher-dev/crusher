import React, {useMemo, useEffect, useRef, useCallback} from "react"
import {renderToStaticMarkup} from "react-dom/server"
// import Tagify from "@yaireo/tagify/dist/tagify.min.js"
import Tagify from "./tagify.js"


const noop = _ => _

const isSameDeep = (a,b) => {
    const trans = x => typeof x == 'string' ? x : JSON.stringify(x)
    return trans(a) == trans(b)
}

// if a template is a React component, it should be outputed as a String (and not as a React component)
function templatesToString(templates) {
    if (templates) {
        for (let templateName in templates) {
            let Template = templates[templateName]
            let isReactComp = String(Template).includes("jsxRuntime")
            if (isReactComp) {
                templates[templateName] = (...props) => (console.log({props}), renderToStaticMarkup(<Template props={props} />))
            }
        }
    }
}

const TagifyWrapper = ({
    name,
    value,
    loading = false,
    onInput = noop,
    onAdd = noop,
    onRemove = noop,
    onEditInput = noop,
    onEditBeforeUpdate = noop,
    onEditUpdated = noop,
    onEditStart = noop,
    onEditKeydown = noop,
    onInvalid = noop,
    onClick = noop,
    onKeydown = noop,
    onFocus = noop,
    onBlur = noop,
    onChange = noop,
    onDropdownShow = noop,
    onDropdownHide = noop,
    onDropdownSelect = noop,
    onDropdownScroll = noop,
    onDropdownNoMatch = noop,
    onDropdownUpdated = noop,
    readOnly,
    disabled,
    children,
    settings = {},
    InputMode = "input",
    autoFocus,
    className,
    whitelist,
    tagifyRef,
    placeholder = "",
    defaultValue,
    showDropdown
}) => {
    const mountedRef = useRef()
    const inputElmRef = useRef()
    const tagify = useRef()
    const _value = defaultValue || value

    const inputAttrs = useMemo(() => ({
        ref: inputElmRef,
        name,
        defaultValue: children || typeof _value == 'string' ? _value : JSON.stringify(_value),
        className,
        readOnly,
        disabled,
        autoFocus,
        placeholder,
    }), [])

    const setFocus = useCallback(() => {
        autoFocus && tagify.current && tagify.current.DOM.input.focus()
    }, [tagify])

    useEffect(() => {
        templatesToString(settings.templates)

        if (InputMode == "textarea")
            settings.mode = "mix"

        // "whitelist" prop takes precedence
        if( whitelist && whitelist.length )
            settings.whitelist = whitelist

        const t = new Tagify(inputElmRef.current, settings)

        t.on("input"  , onInput)
         .on("add"    , onAdd)
         .on("remove" , onRemove)
         .on("invalid", onInvalid)
         .on("keydown", onKeydown)
         .on("focus"  , onFocus)
         .on("blur"   , onBlur)
         .on("click"  , onClick)
         .on("change" , onChange)

         .on("edit:input"       , onEditInput)
         .on("edit:beforeUpdate", onEditBeforeUpdate)
         .on("edit:updated"     , onEditUpdated)
         .on("edit:start"       , onEditStart)
         .on("edit:keydown"     , onEditKeydown)

         .on("dropdown:show"   , onDropdownShow)
         .on("dropdown:hide"   , onDropdownHide)
         .on("dropdown:select" , onDropdownSelect)
         .on("dropdown:scroll" , onDropdownScroll)
         .on("dropdown:noMatch", onDropdownNoMatch)
         .on("dropdown:updated", onDropdownUpdated)

        // Bridge Tagify instance with parent component
        if (tagifyRef) {
            tagifyRef.current = t
        }

        tagify.current = t

        setFocus()

        // cleanup
        return () => {
            t.destroy()
        }
    }, [])

    useEffect(() => {
        setFocus()
    }, [autoFocus])

    useEffect(() => {
        if (mountedRef.current) {
            tagify.current.settings.whitelist.length = 0

            // replace whitelist array items
            whitelist && whitelist.length && tagify.current.settings.whitelist.push(...whitelist)
        }
    }, [whitelist])

    useEffect(() => {
        const currentValue = tagify.current.getInputValue()

        if (mountedRef.current && !isSameDeep(value, currentValue)) {
            tagify.current.loadOriginalValues(value)
        }
    }, [value])

    useEffect(() => {
        if (mountedRef.current) {
            tagify.current.toggleClass(className)
        }
    }, [className])

    useEffect(() => {
        if (mountedRef.current) {
            tagify.current.loading(loading)
        }
    }, [loading])

    useEffect(() => {
        if (mountedRef.current) {
            tagify.current.setReadonly(readOnly || disabled)
        }
    }, [readOnly, disabled])

    useEffect(() => {
        const t = tagify.current

        if (mountedRef.current) {
            if (showDropdown) {
                t.dropdown.show.call(t, showDropdown)
                t.toggleFocusClass(true)
            } else {
                t.dropdown.hide.call(t)
            }
        }
    }, [showDropdown])

    useEffect(() => {
        mountedRef.current = true
    }, [])

    return (
        // a wrapper must be used because Tagify will appened inside it it's component,
        // keeping the virtual-DOM out of the way
        <div className="tags-input">
            <InputMode {...inputAttrs} />
        </div>
    )
}

const Tags = React.memo(TagifyWrapper)
Tags.displayName = "Tags"

export const MixedTags = ({ children, ...rest }) =>
  <Tags InputMode="textarea" {...rest}>{children}</Tags>

export default Tags
