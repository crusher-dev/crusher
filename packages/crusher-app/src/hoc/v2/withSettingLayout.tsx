import { css } from "@emotion/core";
import Head from "next/head";
import { DropDown } from "@ui/components/project/DropDown";
import Link from "next/link";
import { useSelector } from "react-redux";
import { getProjects, getSelectedProject } from "@redux/stateUtils/projects";
import {
    addProjectInRedux,
    saveSelectedProjectInRedux,
} from "@redux/actions/project";
import { store } from "@redux/store";
import React, { CSSProperties, useCallback, useEffect, useState } from "react";


export function WithSettingsLayout(Component, shouldHaveGetInitialProps = true) {
    const WrappedComponent = function (props) {


        return (
            <div>
                <Head>
                    <title>Crusher | Create your first test</title>
                    <link
                        href="/assets/img/favicon.png"
                        rel="shortcut icon"
                        type="image/x-icon"
                    />
                </Head>
                <div>
                    <Component {...props} />
                </div>
            </div>
        );
    };
    if (shouldHaveGetInitialProps) {
        WrappedComponent.getInitialProps = async (ctx) => {
            const pageProps =
                Component.getInitialProps && (await Component.getInitialProps(ctx));
            return { ...pageProps };
        };
    }

    return WrappedComponent;
}
