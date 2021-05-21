import { FC } from 'react'
import { makeStyles, Theme, Typography, TypographyTypeMap } from '@material-ui/core'
import { RouteLink } from '../route/RouteLink'
import { getUserName } from '../../../common/forum/utils'
import { IUser } from '../../../common/forum/forum.base.interfaces'
import { isString } from '../../../common/type-guards'
import { IUserEx, IUserExMin } from '../../../common/forum/forum.ex.interfaces'
import { UserAvatar } from './UserAvatar'


interface Props {
  user?: IUserExMin | string
  color?: TypographyTypeMap['props']['color'] | string
  avatar?: boolean
  className?: string
}


export const useStyles = makeStyles((theme: Theme) => (
  {
    link: {
      color: (props: Props) => props.color,
      textDecoration: 'none',
      fontWeight: 500,
    },
  }
))

export const UserLink: FC<Props> = (props) => {
  const {
    user,
    children,
    color = '#B57F00',
    className,
    avatar = false
  } = props

  const classes = useStyles({color})
  const CN = [className, classes.link].join(' ')

  return (
    user ?
      (isString(user) ?
        (
          <span className={CN}>{children ? children : user}</span>
        ):
        (
          <RouteLink className={CN} to={'user'} route={{ user }}>{
            children ?
              children :
              (avatar && user.avatar ? <><UserAvatar user={user} size={'small'}/> {getUserName(user)}</> : getUserName(user))
          }</RouteLink>
        )
      ) :
      <Typography className={CN}>{children ? children : 'Гость'}</Typography>
  )
}
