import React from "react";
import { MainHeading } from '@theme/Heading';
import { css } from "@emotion/css";
import Comparison from "../components/page/code";
import CodeBlock from "../theme/CodeBlock";


const SelectElementContainer = () => {
    return (
        <div style={{ padding: "6px 0px" }}>
            <div>
                <CodeBlock className={"language-javascript"}>{`const { page } = crusherSdk;
// Waits till the element is visible, with default timeout (30s)
let element = await page.waitForSelector("#button");
 
`}

                    {`// Waits till the element is visible, with 5s timeout
let element = await page.waitForSelector("#button", { timeout: 5000 });
`}
                </CodeBlock>
            </div>
            <div className={timeoutCss}>Default timeout (30s)</div>
        </div>
    )
};

const ClickOnElement = () => {
    return (
        <div style={{ padding: "6px 0px" }}>
            <div>
                <CodeBlock className={"language-javascript"}>{`const { page } = crusherSdk;
// Select an element and click on it
const element = await crusherSdk.page.waitForSelector("selector");
await element.click();
 
`}

                    {`// Click on an element directly
await crusherSdk.page.click("selector");
`}


                </CodeBlock>
            </div>
            <div className={timeoutCss}>Default timeout (30s)</div>
        </div>
    )
}

const HoverOnElement = () => {
    return (
        <div style={{ padding: "6px 0px" }}>
            <div>
                <CodeBlock className={"language-javascript"}>{`// Select an element and hover on it
const element = await crusherSdk.page.waitForSelector("selector");
await element.hover();
 
`}

                    {`// Hover on an element directly
await crusherSdk.page.hover("selector");
`}


                </CodeBlock>
            </div>
            <div className={timeoutCss}>Default timeout (30s)</div>
        </div>
    )
}

const ScreenshotOfElement = () => {
    return (
        <div style={{ padding: "6px 0px" }}>
            <div>
                <CodeBlock className={"language-javascript"}>{`// Select an element and take screenshot
const element = await crusherSdk.page.waitForSelector("selector");
await element.screenshot();
`}

                </CodeBlock>
            </div>
            <div className={timeoutCss}>Default timeout (30s)</div>
        </div>
    )
}
const MousePageContainer = () => {
    return (
        <div style={{ padding: "6px 0px" }}>
            <div>
                <CodeBlock className={"language-javascript"}>{`// Using ‘page.mouse’ to trace a 100x100 square.
const { page } = crusherSdk;
await page.mouse.move(0, 0);
await page.mouse.down();
await page.mouse.move(0, 100);
await page.mouse.move(100, 100);
await page.mouse.move(100, 0);
await page.mouse.up();`}

                </CodeBlock>
            </div>
            <div className={timeoutCss}>Default timeout (30s)</div>
        </div>
    )
};
const KeyboardPageContainer = () => {
    return (
        <div style={{ padding: "6px 0px" }}>
            <div>
                <CodeBlock className={"language-javascript"}>{`// Typing something and copying all the text to clipboard
const { page } = crusherSdk;
 
await page.keyboard.type("Hello World");
await page.keyboard.press('Shift+KeyA');
await page.keyboard.press('Control+KeyC');
`}

                </CodeBlock>
            </div>
            <div className={timeoutCss}>Default timeout (30s)</div>
        </div>
    )
};
const AssertionsOnElement = () => {
    return (
        <div style={{ padding: "6px 0px" }}>
            <div>
                <CodeBlock className={"language-javascript"}>{`const { page } = crusherSdk;
 
const pageTitle = await page.title();
expect(pageTitle.length).toBeGreaterThan(10);
expect(pageTitle).toBe("Crusher docs");
`}

                </CodeBlock>
            </div>
            <div className={timeoutCss}>Default timeout (30s)</div>
        </div>
    )
};

const timeoutCss = css`
    color: #414141;
    margin-left: 4px;
    font-size: 12px;
`;
const coreItems = [
    { id: "Selecting", content: (<SelectElementContainer />) },
    { id: "Click", content: (<ClickOnElement />) },
    { id: "Hover", content: (<HoverOnElement />) },
    { id: "Screenshot", content: (<ScreenshotOfElement />) },
    { id: "Assertions", content: (<AssertionsOnElement />) },
];

const pageItems = [
    { id: "Mouse", content: (<MousePageContainer />) },
    { id: "Keyboard", content: (<KeyboardPageContainer />) },
];


export const CustomCodeHeader = () => {
    return (
        <div className={'flex items-center'} className={headerCss}>
        <div>
            <MainHeading style={{ margin: 0, padding: 0 }}>Code Usecases</MainHeading>
            <div className={headerDescriptionCss}>
                Extend your test with code steps
            </div>
        </div>
        {/* <div style={{ marginLeft: "auto" }} className="flex">
            <input className={searchInputCss} type="text" placeholder="search APIs" />
        </div> */}
    </div>
    );
};


const CustomCodePage = () => {

    const handleTabCallback = (id) => {
        // alert("Clicked on " + id);
    }
    return (
            <div className={contentCss}>

                <div className={'flex comparison-group'}>
                    <Comparison callback={handleTabCallback} items={coreItems} title={"Core utilities"} className={"flex-1"} />
                    <Comparison callback={handleTabCallback} items={pageItems} title={"Page utilities"} className={"flex-1"} />
                </div>
            </div>
    );
};

const description = css`
    padding-top: 12px;
    color: #737373;
    font-size: 14px;
`

const contentCss = css`
    margin-top: 36px;
    width: 100%;
    .comparison-group{
        gap: 40px;
        dipsplay: flex;
        >div{
            flex: 1;
            width: 50%;

            @media screen and (max-width: 600px){
                width: initial;
            }
        }
    }

    @media screen and (max-width: 600px){
        .comparison-group{
            flex-direction: column;
        }

    }
    
`;
const containerCss = css`
    padding-top: 40px;
    font-family: 'Gilroy';

`;

const headerCss = css`
    width: 100%;
    padding-bottom; 20px;

`;
const headerDescriptionCss = css`
    padding-top: 12px;
    color: #737373;
    font-size: 14px;
`;
const searchInputCss = css`
    background: rgba(0, 0, 0, 0.11);
    border: 0.5px solid rgba(237, 237, 237, 0.11);
    border-radius: 8px;
    width: 204px;
    padding: 8px 12px;

    font-family: 'Gilroy';
    font-style: normal;
    font-weight: 400;
    font-size: 13px;
    outline: none;
`;
export { CustomCodePage };