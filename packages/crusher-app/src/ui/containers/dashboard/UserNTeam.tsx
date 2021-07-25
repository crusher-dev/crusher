import { css } from '@emotion/react';
import { UserImage } from 'dyson/src/components/atoms/userimage/UserImage';
import { userAtom } from '../../../store/atoms/global/user';
import { useAtom } from 'jotai';
import { teamAtom } from '../../../store/atoms/global/team';

export function UserNTeam() {
	const [user] = useAtom(userAtom)
	const [team] = useAtom(teamAtom)
	return <div className={'flex justify-between leading-none'} css={userCard}>
		<div className={'flex'} css={orgName}>
			<div css={nameInitial} className={'flex items-center justify-center uppercase font-700 pt-2 mr-14'}>{team.name.substr(0,1)}</div>
			<div>
				<div className={'font-cera mb-4 font-600'} css={name}>
					{team.name}
				</div>
				<div css={description} className={'font-500 leading-none capitalize'}>
					{team.plan.toLowerCase()}
				</div>
			</div>
		</div>
		<div className={'flex items-center pr'}>
				<UserImage url={user.avatar}/>
		</div>
	</div>;
}

export function MenuItemHorizontal({children, selected, ...props}){
	return (
			<div css={[menuLink, selected && menuSelected]} {...props}>{children}</div>
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

const menuSelected = css`
    background: rgba(255, 255, 255, 0.05);
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

