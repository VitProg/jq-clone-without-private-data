import { observer } from 'mobx-react-lite'
import { store } from '../../store'
import { Box, Container, Typography } from '@material-ui/core'
import { useStyles } from './styles'


export const PageTitle = observer(function PageTitle () {

  const classes = useStyles()

  return (
    <>
      {store.uiStore.pageTitle &&
      <Box className={classes.container}>
        <Typography variant='h4' component='h1' color='primary'>{store.uiStore.pageTitle}</Typography>
      </Box>}
    </>
  )
})
