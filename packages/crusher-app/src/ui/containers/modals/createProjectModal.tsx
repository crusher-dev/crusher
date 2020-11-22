import React from "react";
import {css} from "@emotion/core";

class CreateProjectModal extends React.Component{
    render() {
        return (
            <div>
                <div css={styles.container}>
                    <div>Create a project</div>
                    <div>in your team</div>
                </div>
                <div css={styles.body}>
                    <div>Structure your team in a nice-manner.</div>

                    <label htmlFor={"projectName"}>
                        Project name
                    </label>
                    <input id={"projectName"} placeholder={"Enter your project name"}/>

                    <label>
                        <div>Members to the project</div>
                        <div>All members get updates. You can modify this from project settings.</div>
                    </label>
                    <div css={styles.button}>
                        Create a new project
                    </div>
                </div>
            </div>
        );
    }
}

const styles = {
    container: css`
            
    `,
    body: css`
    
    `,
    button: css`
        
    `
}

export {CreateProjectModal};
