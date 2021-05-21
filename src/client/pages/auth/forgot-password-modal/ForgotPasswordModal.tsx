import { FC } from 'react'
import { Button, Grid, Link, Typography } from '@material-ui/core'
import { observer } from 'mobx-react-lite'
import { useInjection } from '../../../ioc/ioc.react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { IAuthService } from '../../../services/my/types'
import { AuthServiceSymbol } from '../../../services/ioc.symbols'
import { useStyles } from './styles'
import { Modal } from '../../../components/modal/Modal'
import { RouteLink } from '../../../components/route/RouteLink'
import { ModalProps } from '../../../components/types'
import { AlternateEmailOutlined } from '@material-ui/icons'
import { TextField } from '../../../components/ui-kit/text-field/TextField'
import { store } from '../../../store'
import { useFormatMessage } from '../../../hooks/use-format-message.hook'


const schema = z.object({
  email: z.string().nonempty('email'),
})

type Schema = z.infer<typeof schema>;

type Props = ModalProps

const intlPrefix = 'ForgotPasswordModal'

export const ForgotPasswordModal: FC<Props> = observer(function ForgotPasswordModal (props) {
  const t = useFormatMessage()

  store.seoStore.setTitle(t(`${intlPrefix}:page-title`))

  const classes = useStyles()

  const {
    errors,
    control,
    handleSubmit,
    setError,
  } = useForm<Schema>({
    resolver: zodResolver(schema),
  })

  const authService = useInjection<IAuthService>(AuthServiceSymbol)

  const onSubmit = async (data: Schema) => {
    debugger
    // todo
  }

  return (
    <Modal
      isOpen={props.isOpen}
      onClose={props.onClose}
      classNames={{ paper: classes.modalPaper }}
      form={{
        onSubmit: handleSubmit(onSubmit)
      }}

      header={() => (
        <Typography component="h1" variant="h5">
          {t(`${intlPrefix}:modal-title`)}
        </Typography>
      )}

      content={() => (
        <>
          <TextField
            name='email'
            intlPrefix={intlPrefix}
            control={control}
            errors={errors}
            margin="normal"
            fullWidth
            autoComplete="email"
            startIcon={AlternateEmailOutlined}
            autoFocus
          />
        </>
      )}

      footer={() => (
        <>
          <Button
            type="submit"
            size="large"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            {t(`${intlPrefix}:button.submit`)}
          </Button>
          <Grid container>
            <Grid item xs>
              <RouteLink to={'login'} component={Link} variant="body2">
                {t(`${intlPrefix}:link.login`)}
              </RouteLink>
            </Grid>
            <Grid item>
              <RouteLink to={'registration'} component={Link} variant="body2">
                {t(`${intlPrefix}:link.registration`)}
              </RouteLink>
            </Grid>
          </Grid>
        </>
      )}
    />
  )
})
