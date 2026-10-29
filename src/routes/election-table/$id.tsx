import { createFileRoute } from '@tanstack/react-router'
import {ResultsTable} from '../../Components.tsx'

export const Route = createFileRoute('/election-table/$id')({
  component: RouteComponent,
})


const urls_by_locale = [
  {outlet: "guilford", url: "https://er.ncsbe.gov/enr/20260303/data/results_41.txt?v=22-15-12"},
  {outlet: "wake", url: "https://er.ncsbe.gov/enr/20260303/data/results_92.txt?v=22-15-12"},
  {outlet: "durham", url: "https://er.ncsbe.gov/enr/20260303/data/results_32.txt?v=22-15-12"},
  {outlet: "cumberland", url: "https://er.ncsbe.gov/enr/20260303/data/results_26.txt?v=22-15-12"},
  {outlet: "state", url: "https://er.ncsbe.gov/enr/20260303/data/results_0.txt?v=22-15-12"},
  {outlet: "bladen", url: "https://er.ncsbe.gov/enr/20260303/data/results_9.txt?v=22-15-12"},
  {outlet: "columbus", url: "https://er.ncsbe.gov/enr/20260303/data/results_24.txt?v=22-15-12"},
  {outlet: "robeson", url: "https://er.ncsbe.gov/enr/20260303/data/results_78.txt?v=22-15-12"},
  {outlet: "scotland", url: "https://er.ncsbe.gov/enr/20260303/data/results_83.txt?v=22-15-12"},
  {outlet: "orange", url: "https://er.ncsbe.gov/enr/20260303/data/results_68.txt?v=22-15-12"},
]

function RouteComponent() {
  const params = Route.useParams();
  let input_props = ["0", "2117"];
  // cid , lid
  input_props = params.id.split("_");
  //const url = urls_by_locale.find(locale => locale.outlet == input_props[0])?.url ?? "";
//<div><ResultsTable {} /></div>
  return (
    <>
    <div id = "results-table">
      <ResultsTable input_props={input_props}/>
    </div>
    </>
    )
}
