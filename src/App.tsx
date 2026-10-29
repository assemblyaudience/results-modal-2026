/* eslint-disable no-use-before-define */ 


import { useState } from 'react';
import {Table, Button} from "@mantine/core";
import './App.css';
import {GetResultsNCSBE} from './functions.ts'
import {ResultsTable, OptionsTable} from './Components.tsx';
import races from './list_of_races.json';


function PlainResultsTable({race}:{race:unknown[]}) {
  const rows = race.map((res_rows: any) => (
    <tr key={res_rows.candidate}>
      <td>{res_rows.candidate}</td>
      <td>{res_rows.votes}</td>
      <td>{res_rows.percent}</td>
    </tr>
  ));

  return (
    <table>
      <thead>
        <tr>
          <th>Candidate</th>
          <th>Votes</th>
          <th>Percent</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
    );
}


export function App() {


  const [options, setOptions] = useState();
  const [ncsbeurl, getURL] = useState(" ");

    return (
      <>
        <div id="list">
          <h3>Append /election-table/ plus the county number + "_" + race id to the URL to display results</h3>
          <p> For instance, https://results-modal.pages.dev/election-table/4_2141 will displace the NC-13 Dem primary</p>
        </div>
        <table>
          <tr>
            <td>State</td>
            <td>Wake</td>
            <td>Durham</td>
            <td>Cumberland</td>
            <td>Guilford</td>
          </tr>
          <tr>
            <td>0</td>
            <td>1</td>
            <td>2</td>
            <td>3</td>
            <td>4</td>
          </tr>
          <tr>
            <td>Bladen</td>
            <td>Columbus</td>
            <td>Robeson</td>
            <td>Scotland</td>
            <td>Orange</td>
          </tr>
          <tr>
            <td>5</td>
            <td>6</td>
            <td>7</td>
            <td>8</td>
            <td>9</td>
          </tr>
        </table>
        <div id = "options"><OptionsTable /></div>
    </>
    )
}
//{JSON.stringify(races)}
