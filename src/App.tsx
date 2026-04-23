import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Collections from './Collections';
import Products from './Products';
import HomePage from './HomePage';

function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage />}/>
        <Route path='/collections' element={<Collections />}/>
        <Route path='/products' element={<Products />}/>
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
