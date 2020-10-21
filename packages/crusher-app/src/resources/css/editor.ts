import { css, jsx } from "@emotion/core";
// };
export const editorCss = `

#__next{
    height: 100vh;
}
body{
    background: #0a0c0c;
    font-family: Panton;
}


.container{
    max-width: 600px;
    margin: 0 auto;
    padding: 40px 0;

}

.top-bar{
    display: flex;
    justify-content: space-between;
    margin-bottom: 36px;
}

.welcome-message{
    font-style: normal;
    font-weight: bold;
    font-size: 18px;
    line-height: 25px;
    color: #FFFFFF;
}

.top-bar__actionable span{
    font-size: 12px;
    color: #FFFFFF;
    margin-left: 20px;
}

.code-section{
    background: #0C0D10;
    box-sizing: border-box;
    box-shadow: inset 0px 0px 4px #000000;
    border-radius: 5px;
    height: 350px;
    margin: 30px 0;
    width: 100%;
    padding: 20px 20px;
    font-size: 12px;
    color: #464646;
    overflow: scroll;
}

.heading-container{
    display: flex;
    justify-content: space-between;
    color: #FFFFFF;
    align-items: center;
    margin-bottom: 20px;
}

.heading-container .heading{
    font-weight: 600;
    font-size: 21px;
}

.heading-container .button{
    background: #555555;
    border: 2px solid #2A2B2C;
    box-sizing: border-box;
    border-radius: 5px;
    padding: 8px 24px;
    font-size: 13px;
}

.description-container{
    color: #FFFFFF;
    margin-bottom: 40px;
    font-size: 14px;
    line-height: 2.1;
}

.demo-btn-signup{
    background: #FF65A6;
    border: 2px solid #CF3576;
    box-sizing: border-box;
    border-radius: 5px;
    padding: 10px 24px;
    font-size: 16px;
    color: #FFFFFF;
    display: inline;
    font-weight: 600;
}
`;
