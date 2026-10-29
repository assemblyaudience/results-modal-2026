
 type County = {
  bct: number;
  bpt: string;
  cid: number;
  cnm: string;
  imp: string;
  ppt: string;
  prt: number;
  ptl: number;
  rtl: number;
  sub: string;
  tle: string;
  vwp: string;
};

export async function set_list_of_races(url: string) {
  const response = await GetResultsNCSBE(url);
  const new_array = [];
  for (let i = 0; i < response.length; i++) {
    for (let j = 0; j < response[i].length; j++) {
      let new_dictionary = {
          page: i,
          cnm: "",
          lid: "",
                }

        new_dictionary.cnm = response[i][j].cnm;
        new_dictionary.lid =response[i][j].lid;
        new_array.push(new_dictionary);}
    }
    const filtered_array = get_duplicates(new_array);
    console.log(filtered_array[3]);
    return filtered_array;

}

function get_duplicates(arr_of_dicts: any[]) {
  const election_options = new Array();
  const deduped = new Array();
  console.log(arr_of_dicts[3]);
  for (var i = 0; i < arr_of_dicts.length; i++) {
    //cnm is the unique race name
    var race = arr_of_dicts[i].lid;
    if (!(election_options.includes(race))) {
      deduped.push(arr_of_dicts[i]);
      election_options.push(race);
    }
  }
  return deduped;
}

export async function GetResultsNCSBE(url: string) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Response status: {$response.status}');
      }
      const result = await response.json();
      //const duplicates_removed = eatDelete(result);
      return result;
    } catch (e: any) {
      console.error(e.message, url);
    };
  }

function eatDelete(results_table: {[key:string]: string}[]) {
//TODO: make a function which returns only the largest value (statewide) when duplicate entries
  const proper = results_table.filter((entry) => 
    (entry.cid == "0") || !((get_duplicates(results_table)).includes(entry.cnm)));
// something here in the filtering is not working but I don't know what. The cid filter is fine
  return proper;
}

export function results_parser(results_table: {[key:string]: string}[]) {
	const new_array = [];
  	for (let i = 0; i < results_table.length; i++) {
      let new_dictionary = {
          race: "",
          candidate: "",
          votes: "",
          percent: "",
          lid: "",
          cid: ""
        }
        new_dictionary.race = results_table[i].cnm;
        new_dictionary.candidate = results_table[i].bnm;
        new_dictionary.votes = results_table[i].vct;
        new_dictionary.percent = (parseFloat(results_table[i].pct)* 100).toFixed(2) + "%";
        new_dictionary.lid = results_table[i].lid;
        new_dictionary.cid = results_table[i].cid;
        new_array.push(new_dictionary);
      }
	return new_array;
}