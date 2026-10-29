import { createFileRoute } from '@tanstack/react-router'
import { WPSimple } from '../Components.tsx'


export const Route = createFileRoute('/$id')({
  component: RouteComponent,
})

function RouteComponent() {
    const params = Route.useParams();

  return (<>
        <div className="p-2">Copy and paste the following into a Wordpress custom HTML block</div>
        <div><WPSimple input_props={params.id}/></div>
    </>)
}
