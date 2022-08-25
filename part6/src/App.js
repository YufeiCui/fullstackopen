import NewNote from "./components/NewNote";
import Notes from "./components/Notes";
import NotesFilter from "./components/NotesFilter";

const App = () => {
  /**
   * Note: cannot initialize data here whilst having the store being passed to the app
   * This will cause an infinite loop:
   * add note (in App) -> store update -> add note (in App) -> store update -> ...
   */
  // dispatch({
  //   type: 'NEW_NOTE',
  //   data: {
  //     content: 'the app state is in redux store',
  //     important: true,
  //     id: 1
  //   }
  // })

  return (
    <div>
      <NewNote />
      <NotesFilter/>
      <Notes />
    </div>
  )
}

export default App;
