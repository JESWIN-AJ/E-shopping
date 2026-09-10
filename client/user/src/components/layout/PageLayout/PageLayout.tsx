import { Outlet } from 'react-router-dom'
import { Header } from '../Header/Header'

export function PageLayout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  )
}