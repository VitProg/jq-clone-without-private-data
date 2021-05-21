import { FC, useMemo, useRef, useState } from 'react'
import {
  Grow,
  IconButton,
  InputAdornment,
  InputProps,
  Paper,
  Popover,
  Popper,
  TextField,
  Typography
} from '@material-ui/core'
import { TextFieldProps } from '@material-ui/core/TextField/TextField'
import { SvgIconComponent, Visibility, VisibilityOff } from '@material-ui/icons'
import { Control, Controller, FieldErrors } from 'react-hook-form'
import { translateField } from '../utils'
import { isString } from '../../../../common/type-guards'
import { useIntl } from '../../../hooks/use-intl.hook'
import { useStyles } from './styles'


type Props = {
  name: string
  startIcon?: SvgIconComponent
  onStartIconClick?: () => void,
  withShowPassword?: boolean
  control?: Control
  errors?: FieldErrors
  intlPrefix?: string
} & TextFieldProps

export const PasswordInput: FC<Props> = (props) => {
  const {
    startIcon: StartIcon = undefined,
    onStartIconClick,
    withShowPassword = true,
    control,
    errors,
    intlPrefix,
    ...inputProps
  } = props

  const classes = useStyles()

  const intl = useIntl()
  const translate = (type: string, key?: any) => translateField(intl, intlPrefix, type, key)

  if (intlPrefix) {
    if (isString(inputProps.label)) {
      inputProps.label = translate('field', inputProps.label)
    } else {
      inputProps.label = translate('field', inputProps.name)
    }
  }

  const [passwordShowed, setPasswordShowed] = useState(false)
  const showPassword = () => {
    handlePopoverClose()
    setPasswordShowed(true)
  }
  const hidePassword = () => setPasswordShowed(false)

  const popoverRef = useRef<HTMLElement>(null)
  const [popoverShowed, setPopoverShowed] = useState(false)

  const handlePopoverOpen = () => {
    setPopoverShowed(true)
  }

  const handlePopoverClose = () => {
    setPopoverShowed(false)
  }

  const adornments: InputProps = useMemo(() => ({
    startAdornment: StartIcon && (
      <InputAdornment position="start">
        {onStartIconClick ?
          <IconButton onClick={onStartIconClick}><StartIcon/></IconButton> :
          <StartIcon/>
        }
      </InputAdornment>
    ),
    endAdornment: withShowPassword && (
      <InputAdornment position="end">
        <div
          onMouseEnter={handlePopoverOpen}
          onMouseLeave={handlePopoverClose}
        >
          <IconButton
            buttonRef={popoverRef}
            aria-label="toggle password visibility"
            onMouseDown={showPassword}
            onMouseUp={hidePassword}
          >
            {passwordShowed ? <Visibility/> : <VisibilityOff/>}
          </IconButton>
        </div>
      </InputAdornment>
    ),
  }), [StartIcon, onStartIconClick, withShowPassword, passwordShowed])

  const hasError = !!(errors && errors[props.name as any])
  const helperText = errors ? translate('error', errors[props.name as any]?.message) : translate('field-help', props.helperText)

  return control ?
    (
      <>
        <Controller
          as={TextField}
          control={control}
          error={hasError}
          helperText={helperText}
          defaultValue=''
          autoComplete="current-password"
          {...inputProps}
          type={passwordShowed ? 'text' : 'password'}
          InputProps={adornments}
          onFocus={props.onFocus as ((() => void) | undefined)}
        />
        {withShowPassword &&
        <Popper
          open={popoverShowed}
          disablePortal={true}
          anchorEl={popoverRef.current}
          transition

          // anchorReference="anchorPosition"
          // anchorPosition={{ left: 100, top: 100 }}
          // anchorOrigin={{
          //   vertical: 'bottom',
          //   horizontal: 'center',
          // }}
          // transformOrigin={{
          //   vertical: 'top',
          //   horizontal: 'center',
          // }}
        >
          {({ TransitionProps }) => (
            <Grow {...TransitionProps}>
              <Paper className={classes.popover}>
                {intl.formatMessage({ id: 'PasswordInput:show-password' })}
              </Paper>
            </Grow>
          )}
        </Popper>
        // <Popover
        //   open={popoverShowed}
        //   disablePortal={true}
        //   anchorEl={popoverRef.current}
        //
        //   // anchorReference="anchorPosition"
        //   // anchorPosition={{ left: 100, top: 100 }}
        //   anchorOrigin={{
        //     vertical: 'bottom',
        //     horizontal: 'center',
        //   }}
        //   transformOrigin={{
        //     vertical: 'top',
        //     horizontal: 'center',
        //   }}
        // >
        //   <Typography className={classes.popover}>
        //     {intl.formatMessage({ id: 'PasswordInput:show-password' })}
        //   </Typography>
        // </Popover>
        }
      </>
    ) :
    (
      <TextField
        defaultValue=''
        autoComplete="current-password"
        {...inputProps}
        type={passwordShowed ? 'text' : 'password'}
        InputProps={adornments}
      />
    )
}
