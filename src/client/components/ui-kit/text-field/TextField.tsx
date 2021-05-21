import { FC, useMemo } from 'react'
import { IconButton, InputAdornment, InputProps, TextField as MuiTextField } from '@material-ui/core'
import { TextFieldProps } from '@material-ui/core/TextField/TextField'
import { SvgIconComponent } from '@material-ui/icons'
import { Control, Controller, FieldErrors } from 'react-hook-form'
import { useIntl } from 'react-intl'
import { isString } from '../../../../common/type-guards'
import { translateField } from '../utils'


type Props = {
  name: string
  startIcon?: SvgIconComponent
  onStartIconClick?: () => void,
  endIcon?: SvgIconComponent
  onEndIconClick?: () => void,
  control?: Control
  errors?: FieldErrors
  intlPrefix?: string
} & TextFieldProps

export const TextField: FC<Props> = (props) => {
  const {
    startIcon: StartIcon = undefined,
    endIcon: EndIcon = undefined,
    onStartIconClick,
    onEndIconClick,
    control,
    errors,
    intlPrefix,
    ...inputProps
  } = props

  const intl = useIntl()
  const translate = (type: string, key?: any) => translateField(intl, intlPrefix, type, key)

  if (intlPrefix) {
    if (isString(inputProps.label)) {
      inputProps.label = translate('field', inputProps.label)
    } else {
      inputProps.label = translate('field', inputProps.name)
    }
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
    endAdornment: EndIcon && (
      <InputAdornment position="end">
        {onEndIconClick ?
          <IconButton onClick={onEndIconClick}><EndIcon/></IconButton> :
          <EndIcon/>
        }
      </InputAdornment>
    ),
  }), [StartIcon, EndIcon, onStartIconClick, onEndIconClick])

  const hasError = !!(errors && errors[props.name as any])
  const helperText = errors ? translate('error', errors[props.name as any]?.message) : translate('field-help', props.helperText)

  return control ?
    (
      <Controller
        as={MuiTextField}
        control={control}
        error={hasError}
        helperText={helperText}
        defaultValue=''
        {...inputProps}
        InputProps={adornments}
        onFocus={props.onFocus as ((() => void) | undefined)}
      />
    ) :
    (
      <MuiTextField
        defaultValue=''
        {...inputProps}
        InputProps={adornments}
      />
    )
}
