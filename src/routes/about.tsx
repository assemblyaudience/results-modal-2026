import { createFileRoute } from '@tanstack/react-router'
import { WPSimple } from '../Components.tsx'


export const Route = createFileRoute('/about')({
  component: About,
})



function About() {
  return (
    <>
    <div><WPSimple input_props="4"/></div>
  <div className="p-2">Hello from About!</div>
  </>)
}