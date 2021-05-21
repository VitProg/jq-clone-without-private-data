import { FC } from 'react'
import { Box } from '@material-ui/core'
import { MessageItem, MessageItemProps } from '../message-item/MessageItem'
import { observer } from 'mobx-react-lite'
import { MessageItemSkeleton } from '../message-item-skeleton/MessageItemSkeleton'
import { store } from '../../../store'
import { IMessageEx } from '../../../../common/forum/forum.ex.interfaces'


interface Props {
  messages?: IMessageEx[]
  // relations?: MessageRelationsRecord
  itemProps?: Omit<MessageItemProps, 'message' | 'user'>
}

const skeletons = [79, 120, 60, 100, 88]
//
// const getMessageRelations = (message: IMessage, relations?: MessageRelationsRecord) => {
//   const result: MessageRelationsSingle = {
//     topic: relations?.topic?.[message.linksId.topic],
//     board: relations?.board?.[message.linksId.board],
//     user: relations?.user?.[message.linksId.user],
//   }
//
//   const categoryId = result.board?.linksId.category
//   if (categoryId && relations?.category) {
//     result.category = relations?.category[categoryId]
//   }
//
//   return result
// }

export const MessageList: FC<Props> = observer(function MessageList (props) {
  const {
    itemProps = {},
    messages,
  } = props

  return (
    <Box component="section" m={1}>
      {
        !props.messages || store.uiStore.loading
          ?
          (skeletons).map((h) => (
            <MessageItemSkeleton key={h} messageHeight={h}/>
          ))
          :
          props.messages.map(message => (
              <MessageItem
                key={message.id}
                message={message}
                {...props.itemProps}
              />
            )
          )
      }
    </Box>
  )
})
