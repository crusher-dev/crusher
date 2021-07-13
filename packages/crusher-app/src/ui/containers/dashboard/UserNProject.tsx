import { css } from '@emotion/react';

export function UserNProject() {
	return <div className={'flex justify-between leading-none'} css={userCard}>
		<div className={'flex'} css={orgName}>
			<div css={nameInitial} className={'flex items-center justify-center uppercase font-700 pt-2 mr-14'}>H</div>
			<div>
				<div className={'font-cera mb-4 font-600'} css={name}>
					Crusher
				</div>
				<div css={description} className={'font-500 leading-none'}>
					Hobby
				</div>
			</div>
		</div>
		<div className={'flex items-center pr'}>
			<div css={userImage}>
				<div className={'relative'}>
					<img src={'/assets/img/dashboard/user.png'} height={'20px'} />
					<div css={dotCSS}></div>
				</div>
			</div>
		</div>
	</div>;
}

export function MenuItemHorizontal({children, ...props}){
	return (
			<div css={menuLink} {...props}>{children}</div>
	)
}

const menuLink = css`
  box-sizing: border-box;
  border-radius: 6rem;
  line-height: 13rem;
  height: 30rem;
  padding: 0 12rem;
  color: rgba(255,255,255, 0.8);
  font-weight: 600;
  display: flex;
  align-items: center;

  :hover{
    background: rgba(255, 255, 255, 0.05);
  }
`

const orgName = css`
  padding: 6px 16px 6px 10px;
  :hover{

    background: #202429;
    border-radius: 4px;
  }
`
const userCard = css`

`


const nameInitial = css`
  line-height: 1;
  font-size: 12rem;
  width: 22rem;
  height: 22rem;
  border-radius: 4px;
  background: #E6FF9D;
  color: #46551b;
`


const name = css`
	font-size: 13.2rem;
	color: #D0D0D0;
`

const description = css`
	font-size: 12rem;
	color: #D0D0D0;
`

const userImage = css`

		padding: 6rem 16rem 5rem;
		:hover{
      background: #202429;
      border-radius: 4px;
		}

	 img{
     border-radius: 200rem;
		 height: 22rem ;
		 margin-top: -2rem;
	 }
	`

const dotCSS = css`
	position: absolute;
	background: #7DDA6E;
	right: 1.2px;
	bottom: .4px;
	
	width: 6px;
	height: 6px;
	border-radius: 100px;
	border: 1px solid #f8f8f8;
`