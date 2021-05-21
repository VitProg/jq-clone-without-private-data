import { FC } from 'react'
import { FormatQuoteRounded } from '@material-ui/icons'
import { useStyles } from './styles'
import { ButtonBase } from '@material-ui/core'


export const Quote: FC = (props) => {

  const classes = useStyles()

  return (
    <ButtonBase component='blockquote' className={classes.container}>
      <FormatQuoteRounded className={classes.icon}/>
      <div className={classes.content}>
        {props.children}
      </div>
    </ButtonBase>
  )
}
