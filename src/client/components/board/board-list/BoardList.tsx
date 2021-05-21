import { FC, ReactElement } from 'react'
import { observer } from 'mobx-react-lite'
import { List, ListItem, ListItemText, Typography } from '@material-ui/core'
import { BoardItem } from '../board-item/BoardItem'
import { IBoardEx } from '../../../../common/forum/forum.ex.interfaces'
import { useStyles } from './styles'
import { CategoryItem } from '../../category/category-item/CategoryItem'
import { BoardListHead } from '../board-list-head/BoardListHead'
import { CategoryPartExModel } from '../../../../server/modules/forum/models-ex/category-part-ex.model'
import { ICategoryPartEx } from '../../../../common/forum/forum.part-ex.interfaces'
import { toInt } from '../../../../common/utils/number'
import { store } from '../../../store'
import { toJS } from 'mobx'
import { ICategory } from '../../../../common/forum/forum.base.interfaces'


interface Props {
  boards?: IBoardEx[]
  showCategories?: boolean
  categories?: Record<number, ICategory>
  loading?: boolean
  showSubBoards?: boolean
  showHeads?: boolean
  level?: number
}

export const BoardList: FC<Props> = observer(function BoardList (props) {
  const classes = useStyles()

  const showCategories = !!props.showCategories
  const showHeads = !!props.showHeads
  const loading = props.loading
  const boards = props.loading || !props.boards ? [] : props.boards
  const showLevel = props.level ?? 0
  const categories = props.categories
  const splitByCategories = !!categories

  let lastCategory: IBoardEx['category'] | undefined
  let headAdded = false

  const blocks: ReactElement[] = []
  let currentBlock: ReactElement[] = []

  let finBlock = () => {
    blocks.push(
      <List className={classes.list}>
        {currentBlock.map(block => block)}
      </List>
    )
    currentBlock = []
  }


  const boardsByCategories: Record<number, IBoardEx[]> = {}

  for (const board of boards) {
    const catId = splitByCategories ? (board.category.id ?? 0) : 0

    if (!props.showSubBoards && board.level !== showLevel) {
      continue
    }

    if (!(catId in boardsByCategories)) {
      boardsByCategories[catId] = []
    }
    boardsByCategories[catId].push(board)
  }

  let entries = Object.entries(boardsByCategories)

  if (splitByCategories) {
    entries = entries.sort(([firstCatId], [secondCatId]) => {
      if (!categories) {
        return toInt(firstCatId) - toInt(secondCatId)
      }
      const firstCat = categories[toInt(firstCatId)]
      const secondCat = categories[toInt(secondCatId)]
      return firstCat?.settings.order - secondCat?.settings.order
    })
  }

  return (
    <div className={classes.container}>
      {entries.map(([catId, boardList]) => {
        const category = categories && categories[toInt(catId)]

        let headElement: ReactElement | null = null
        let categoryElement: ReactElement | null = null

        if (splitByCategories) {
          if (showCategories && category) {
            categoryElement = <CategoryItem component='h5' category={category} sticky key={`cat-${category.id}`}/>
          }
          headAdded = false
        }

        if (showHeads && !headAdded) {
          headAdded = true
          headElement = <BoardListHead sticky={!showCategories}/>
        }

        return (
          <div className={classes.listContainer}>
            {categoryElement}
            <List className={classes.list}>
              {headElement}
              {boardList.map(board => <BoardItem board={board} key={`board-${board.id}`} level/>)}
            </List>
          </div>
        )
      })}
    </div>
  )

//     let headElement: ReactElement | null = null
//     let categoryElement: ReactElement | null = null
//
//     if (showCategories && (!lastCategory || board.category.id !== lastCategory.id)) {
//       lastCategory = board.category
//
//       if (lastCategory) {
//         categoryElement = <CategoryItem category={lastCategory} sticky key={`cat-${lastCategory.id}|${board.id}`}/>
//         headAdded = false
//         finBlock()
//       }
//     }
//
//     if (showHeads && !headAdded) {
//       headAdded = true
//       headElement = <BoardListHead sticky={!showCategories}/>
//     }
//
//     if (!props.showSubBoards && board.level !== showLevel) {
//       return null
//     }
//
//     if (categoryElement) {
//       currentBlock.push(categoryElement)
//     }
//     if (headElement) {
//       currentBlock.push(headElement)
//     }
//     currentBlock.push(<BoardItem board={board} key={`board-${board.id}`} level/>)
//   }
//
//   finBlock()
// deb
//   return (
//     <div className={classes.container}>
//       {blocks.map(block => block)}
//     </div>
//   )
  // return (
  //   <List className={classes.list}>
  //     {/**todo**/loading && <div>Loading...</div>}
  //     {boards.map((board: IBoardEx) => {
  //       let headElement: ReactElement | null = null
  //       let categoryElement: ReactElement | null = null
  //
  //       if (showCategories && (!lastCategory || board.category.id !== lastCategory.id)) {
  //         lastCategory = board.category
  //
  //         if (lastCategory) {
  //           categoryElement = <CategoryItem category={lastCategory} sticky key={`cat-${lastCategory.id}|${board.id}`}/>
  //           headAdded = false
  //         }
  //       }
  //
  //       if (showHeads && !headAdded) {
  //         headAdded = true
  //         headElement = <BoardListHead sticky={!showCategories}/>
  //       }
  //
  //       if (!props.showSubBoards && board.level !== showLevel) {
  //         return null
  //       }
  //
  //       return [
  //         categoryElement,
  //         headElement,
  //         <BoardItem board={board} key={`board-${board.id}`} level/>
  //       ]
  //     })}
  //   </List>
  // )
})
