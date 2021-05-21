import { ElementType, FC } from 'react'
import { observer } from 'mobx-react-lite'
import { ListItem, ListItemText, ListSubheader, Typography } from '@material-ui/core'
import { useStyles } from './styles'
import { ICategoryPartEx } from '../../../../common/forum/forum.part-ex.interfaces'
import * as React from 'react'


interface Props {
  category: ICategoryPartEx
  sticky?: boolean
  component?: ElementType
}

export const CategoryItem: FC<Props> = observer(function CategoryItem (props) {

  const classes = useStyles()

  return (
    <ListSubheader component={props.component ?? 'li'} className={classes.item} key={`cat-item-${props.category.id}`} disableSticky={!props.sticky}>
      <Typography variant='h5' component='span'>{props.category.name}</Typography>
    </ListSubheader>
  )
})
