import { Backdrop, Fade, IconButton, Modal as MUIModal } from '@material-ui/core'
import { FC, FormHTMLAttributes, ReactNode, useMemo } from 'react'
import { StyleProps, useModalStyles } from './styles'
import { omit } from '../../../common/utils/object'
import { ModalProps as MainModalProps } from '../types'
import { isFunction } from '../../../common/type-guards'
import { Close } from '@material-ui/icons'
import { joinClassNames, joinClassNamesMass } from '../ui-kit/utils'


export type ModalProps = Partial<StyleProps> & MainModalProps & {
  header?: (() => ReactNode) | ReactNode
  content?: (() => ReactNode) | ReactNode
  footer?: (() => ReactNode) | ReactNode
  form?: FormHTMLAttributes<HTMLFormElement>
  classNames?: {
    modal?: string
    paper?: string
    header?: string
    content?: string
    footer?: string
  }
}

export const Modal: FC<ModalProps> = function Modal (props) {
  const classes = useModalStyles({
    headerColor: 'primary',
    ...omit(props, 'isOpen', 'onClose', 'header', 'content', 'footer', 'form', 'classNames')
  })

  const classNames = useMemo(
    () => (joinClassNamesMass(
      classes,
      {
        ...props.classNames,
        form: props.form ? joinClassNames(classes.form, props.form.className) : '',
      },
    )),
    [props.classNames, props.form]
  )

  const inner = useMemo(() => (
    <Fade in={props.isOpen}>
      <div className={classNames.paper}>
        {props.header && (
          <header className={classNames.header}>
            {isFunction(props.header) ? props.header() : props.header}
            <IconButton onClick={props.onClose} className={classes.headerClose}>
              <Close/>
            </IconButton>
          </header>
        )}
        <section className={classNames.content}>
          {isFunction(props.content) ? props.content() : props.content}
          {props.children}
        </section>
        {props.footer && (
          <header className={classNames.footer}>
            {isFunction(props.footer) ? props.footer() : props.footer}
          </header>
        )}
      </div>
    </Fade>
  ), [props.isOpen, props.onClose, props.header, props.content, props.footer, classNames])

  return (
    <MUIModal
      open={props.isOpen}
      onClose={props.onClose}
      className={classNames.modal}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      {props.form ?
        <form {...props.form} className={classNames.form}>
          {inner}
        </form> :
        inner
      }
    </MUIModal>
  )
}
