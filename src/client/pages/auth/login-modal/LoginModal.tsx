import { FC } from 'react'
import { Button, Grid, Link, Typography } from '@material-ui/core'
import { AccountCircleOutlined, VpnKeyOutlined } from '@material-ui/icons'
import { observer } from 'mobx-react-lite'
import { useInjection } from '../../../ioc/ioc.react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { User } from '../../../../common/forum/models/user'
import { store } from '../../../store'
import { IAuthService } from '../../../services/my/types'
import { AuthServiceSymbol } from '../../../services/ioc.symbols'
import { useStyles } from './styles'
import { Modal } from '../../../components/modal/Modal'
import { RouteLink } from '../../../components/route/RouteLink'
import { ModalProps } from '../../../components/types'
import { TextField } from '../../../components/ui-kit/text-field/TextField'
import { PasswordInput } from '../../../components/ui-kit/password-input/PasswordInput'
import { useIntl } from 'react-intl'
import { useFormatMessage } from '../../../hooks/use-format-message.hook'


const schema = z.object({
  username: z.string().nonempty('login-is-empty'),
  password: z.string().nonempty('password-is-empty'),
  remember: z.boolean().optional(),
})

type Schema = z.infer<typeof schema>;

const intlPrefix = 'LoginModal'

type Props = ModalProps

export const LoginModal: FC<Props> = observer(function LoginModal (props) {
  const classes = useStyles()
  const t = useFormatMessage()

  store.seoStore.setTitle(t(`${intlPrefix}:page-title`))

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
    let user: User | undefined

    try {
      user = await authService.login(data)
      if (store.routeStore.saved) {
        store.routeStore.saved.replace()
      }
      props.onClose()
    } catch {
    } finally {
      if (!user) {
        setError('username', {
          message: 'username-or-password',
          type: 'validate',
        })
      }
    }
  }

  return (
    <Modal
      isOpen={props.isOpen}
      onClose={props.onClose}
      classNames={{paper: classes.modalPaper}}
      form={{
        onSubmit: handleSubmit(onSubmit)
      }}

      header={
        <Typography component="h1" variant="h5">
          {t(`${intlPrefix}:modal-title`)}
        </Typography>
      }

      content={
        <>
          <TextField
            name='username'
            intlPrefix={intlPrefix}
            label={'login'}
            control={control}
            errors={errors}
            margin="normal"
            fullWidth
            autoComplete="email"
            autoFocus
            startIcon={AccountCircleOutlined}
          />
          <PasswordInput
            name='password'
            intlPrefix={intlPrefix}
            control={control}
            errors={errors}
            margin="normal"
            fullWidth
            autoComplete="current-password"
            startIcon={VpnKeyOutlined}
          />
        </>
      }

      footer={
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
              <RouteLink to={'forgotPassword'} component={Link} variant="body2">
                {t(`${intlPrefix}:link.forgot-password`)}
              </RouteLink>
            </Grid>
            <Grid item>
              <RouteLink to={'registration'} component={Link} variant="body2">
                {t(`${intlPrefix}:link.registration`)}
              </RouteLink>
            </Grid>
          </Grid>
        </>
      }
    />
  )
})
