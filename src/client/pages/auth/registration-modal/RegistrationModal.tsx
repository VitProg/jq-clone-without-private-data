import { FC } from 'react'
import { Button, Grid, Link, Typography } from '@material-ui/core'
import { observer } from 'mobx-react-lite'
import { useInjection } from '../../../ioc/ioc.react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { IAuthService } from '../../../services/my/types'
import { AuthServiceSymbol } from '../../../services/ioc.symbols'
import { useStyles } from './styles'
import { Modal } from '../../../components/modal/Modal'
import { RouteLink } from '../../../components/route/RouteLink'
import { ModalProps } from '../../../components/types'
import { AccountCircleOutlined, AlternateEmailOutlined, VpnKeyOutlined } from '@material-ui/icons'
import { PasswordInput } from '../../../components/ui-kit/password-input/PasswordInput'
import { TextField } from '../../../components/ui-kit/text-field/TextField'
import { store } from '../../../store'
import { useFormatMessage } from '../../../hooks/use-format-message.hook'


const schema = z.object({
  login: z.string().nonempty('login-is-empty'),
  email: z.string().nonempty('email-is-empty'),
  password: z.string().nonempty('password-is-empty'),
})

type Schema = z.infer<typeof schema>;

type Props = ModalProps

const intlPrefix = 'RegistrationModal'

export const RegistrationModal: FC<Props> = observer(function RegistrationModal (props) {
  const t = useFormatMessage()

  store.seoStore.setTitle(t(`RegistrationModal:page-title`))

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
      classNames={{paper: classes.modalPaper}}
      form={{
        onSubmit: handleSubmit(onSubmit)
      }}

      header={() => (
        <Typography component="h1" variant="h5">
          {t('RegistrationModal:modal-title')}
        </Typography>
      )}

      content={() => (
        <>
          <TextField
            name='login'
            intlPrefix={intlPrefix}
            control={control}
            errors={errors}
            margin="normal"
            fullWidth
            autoFocus
            startIcon={AccountCircleOutlined}
          />
          <TextField
            name='email'
            intlPrefix={intlPrefix}
            control={control}
            errors={errors}
            margin="normal"
            fullWidth
            autoComplete="email"
            startIcon={AlternateEmailOutlined}
          />
          <PasswordInput
            name='password'
            intlPrefix={intlPrefix}
            control={control}
            errors={errors}
            margin="normal"
            fullWidth
            autoComplete=''
            startIcon={VpnKeyOutlined}
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
            {t('RegistrationModal:button.submit')}
          </Button>
          <Grid container>
            <Grid item xs>
              <RouteLink to={'forgotPassword'} component={Link} variant="body2">
                {t('RegistrationModal:link.forgot-password')}
              </RouteLink>
            </Grid>
            <Grid item>
              <RouteLink to={'login'} component={Link} variant="body2">
                {t('RegistrationModal:link.login')}
              </RouteLink>
            </Grid>
          </Grid>
        </>
      )}
    />
  )
})
