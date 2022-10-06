/*
	Use Jotai for avoiding props drilling.
	Make config much more streamline.
 */
import {css} from "@emotion/react";
import React, {useState} from "react";
import {PlaySVG} from "@svg/dashboard";
import {Conditional} from "dyson/src/components/layouts";
import {Modal} from "dyson/src/components/molecules/Modal";
import { VideoComponent } from "dyson/src/components/atoms/video/video";

export function PlayVideo({videoUrl}) {
    const [openVideoModal, setIsOpenVideoModal] = useState(false);

    return (
        <div className={"flex justify-between items-center mt-6 "}>
            <div className={"flex"}>
                {videoUrl ? (
                    <div
                        css={css`
							display: flex;
							align-items: center;
							gap: 10rem;
							margin-right: 24rem;
							:hover {
								opacity: 0.8;
							}
						`}
                        onClick={setIsOpenVideoModal.bind(this, true)}
                    >
                        <PlaySVG/>
                        <span
                            css={css`
								position: relative;
								top: 2px;
							`}
                        >
							Play video
						</span>
                    </div>
                ) : (
                    ""
                )}
            </div>
            <Conditional showIf={videoUrl && openVideoModal}>
                <TestVideoUrl videoUrl={videoUrl} setOpenVideoModal={setIsOpenVideoModal.bind(this)}/>
            </Conditional>
        </div>
    );
}

export function TestVideoUrl({setOpenVideoModal, videoUrl}) {
    const handleClose = () => {
        setOpenVideoModal(false);
    };
    return (
        <div
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
            }}
        >
            <Modal
                lightOverlay={false}
                onClose={handleClose.bind(this)}
                onOutsideClick={handleClose.bind(this)}
                modalStyle={css`
					padding: 28rem 36rem 36rem;
				`}
            >
                <div className={"font-cera text-16 font-600 leading-none"}>Test video by 🦖</div>
                <div className={"text-13 mt-8 mb-24"}>For better experience, use full screen mode</div>
                <VideoComponent src={videoUrl}/>
            </Modal>
        </div>
    );
}