import './App.css'
import { Button } from './components/ui/button'

function App() {
  return (
    <>
      <div className='bg-cyan-900 w-full h-3xl text-white'>
        <div className="flex min-h-svh flex-col items-center justify-center">
          <Button>Click me</Button>
        </div>
      </div>
    </>
  )
}

export default App
