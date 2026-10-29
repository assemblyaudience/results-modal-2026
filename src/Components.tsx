import { Table, Button } from "@mantine/core";
import { GetResultsNCSBE, results_parser, set_list_of_races, extremely_long_string } from './functions.ts';
import { useState, useEffect } from 'react';
import races from './list_of_races.json';
import endpoint from './url_protector.json';


export function ResultsTable(props: {input_props:string[]}) {


  const [results_table, setResults_Table] = useState<unknown[] | undefined>([]);
  const input_url = endpoint.EP;

  const page = props.input_props[0]
  const race_lid = props.input_props[1]


  function filterAndSetTable(results: any){
    const parsed = results_parser(results[page]);
    const filtered = parsed.filter((item: any) => item.lid == race_lid);
    setResults_Table(filtered);
    return filtered;
  }

  useEffect(() => {
      GetResultsNCSBE(input_url)
        .then(results => filterAndSetTable(results))
    }, [])

  //let filtered = full_results.filter(item => item.lid === "2119")

  const rows = results_table?.map((result: any) => (
      <Table.Tr key={result.candidate}>
        <Table.Td>{result.candidate}</Table.Td>
        <Table.Td>{result.votes}</Table.Td>
        <Table.Td>{result.percent}</Table.Td>
      </Table.Tr>
    ));
///styles={{td: {fontSize: "28px"}, th: {fontSize: "32px"}}}
    return (
      <Table highlightOnHover>
        <Table.Thead>
          <Table.Tr>
          <Table.Th>Candidate</Table.Th>
          <Table.Th>Votes</Table.Th>
          <Table.Th>Percent</Table.Th>
        </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
      );
  }


export function OptionsTable() {
  const input_url = endpoint.EP;
  const [options_dict, setOptionsDict] = useState<Option[] | unknown[]>([]);
  //const options_dict = [];
  //const options_dict = await set_list_of_races(input_url);
  type Option = { cnm: string; lid: string };

  useEffect(() => {
    set_list_of_races(input_url)
    .then(setOptionsDict)
  }, [input_url]);

  const display_table = [];

  for (const key in options_dict) {
    const value = (options_dict as any)[key];
    display_table.push(
      <tr>
          <td>{key}</td>
          <td>{value}</td>
      </tr>
      ); }

  /*json.races.forEach(({ key, val }) =>
    key in options_dict ? options_dict[key].push(val) : options_dict[key] = [val] );*/
  return (    
    <table>
      <thead>
        <tr>
          <th>Race</th>
          <th>Race LID</th>
        </tr>
      </thead>
      <tbody>{options_dict?.map((options: any) =>
      <tr key={options.lid}>
          <td>{options.cnm}</td>
          <td>{options.lid}</td>
      </tr>)}</tbody>
    </table>);
}

export function WPSimple({ input_props }: { input_props: string }) {
  const input_url = endpoint.EP;
  const [options_dict, setOptionsDict] = useState<Option[] | unknown[]>([]);
  const page = input_props;

  type Option = { cnm: string; lid: string };

  useEffect(() => {
    set_list_of_races(input_url)
    .then(setOptionsDict)
  }, [input_url]);

  let full_string = extremely_long_string(page, options_dict);

  return (    
    <div>
      {full_string}
    </div>);
}