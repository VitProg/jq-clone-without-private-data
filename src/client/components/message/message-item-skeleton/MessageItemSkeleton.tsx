import { FC } from 'react'
import { createStyles, ListItem, ListItemAvatar, ListItemText, makeStyles, Theme, Typography } from '@material-ui/core'
import { User } from '../../../../common/forum/models/user'
import parser from 'bbcode-to-react'
import { Skeleton } from '@material-ui/lab'


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    body: {
      whiteSpace: 'pre-line'
    }
  })
)

interface Props {
  messageHeight?: number
}

export const MessageItemSkeleton: FC<Props> = ({messageHeight = 100}) => {
  const classes = useStyles()

  return (
    <ListItem alignItems={'flex-start'}>
      <ListItemAvatar>
        <Skeleton variant='circle' width={40} height={40}/>
      </ListItemAvatar>
      <ListItemText
        primary={
          <div>
            <Skeleton variant='rect' width={100} height={20}/>
            <Typography component='div'>
              <Skeleton variant='text'/>
            </Typography>
          </div>
        }
        secondary={
          <Skeleton variant='rect' width='100%' height={messageHeight}/>
        }
        secondaryTypographyProps={{ component: 'div', className: classes.body }}
      />
    </ListItem>
  )
}
