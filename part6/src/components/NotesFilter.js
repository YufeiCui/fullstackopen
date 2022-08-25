import { useDispatch } from "react-redux"
import Filter from "../filterTypes"
import { filterChange } from "../reducer/filterReducer"

const NotesFilter = () => {
  const dispatch = useDispatch()
  const filterSelected = (type) => {
    if (type in Filter) {
      return dispatch(filterChange(type))
    }
  }

  return (
    <div>
      all<input type="radio" name="filter" onChange={() => filterSelected(Filter.ALL)}></input>
      important<input type="radio" name="filter" onChange={() => filterSelected(Filter.IMPORTANT)}></input>
      non-important<input type="radio" name="filter" onChange={() => filterSelected(Filter.NONIMPORTANT)}></input>
    </div>
  )
}

export default NotesFilter