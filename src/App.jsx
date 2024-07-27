import './App.css'
import AppRouter from "./AppRouter.jsx";
import { PokemonProvider } from "./context/PokemonProvider.jsx";

function App() {

  return (
      <PokemonProvider>
        <AppRouter />
      </PokemonProvider>
  )

}

export default App
