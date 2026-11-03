
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

// TODO: create new type for the set_list_of_races function

export async function set_list_of_races(url: string) {
  const response = await GetResultsNCSBE(url);
  //change page number to County ID? 
  const new_array = [];
  for (let i = 0; i < response.length; i++) {
    for (let j = 0; j < response[i].length; j++) {
      let new_dictionary = {
          page: i,
          cnm: "",
          lid: "",
          ogl: "",
                }

        new_dictionary.cnm = response[i][j].cnm;
        new_dictionary.lid =response[i][j].lid;
        new_dictionary.ogl = response[i][j].ogl;
        new_array.push(new_dictionary);}
    }
    //added the filtering to the components instead
    //const filtered_array = get_duplicates(new_array);
    return new_array;
}

function eatDelete(input: any[]) {
  // The bifurcation between statewide and local elections accounts for the fact
  // that we want to grab some of the local elections from the statewide page
  // because they cross counties. But, we still want
  // them to show up on the local page. 
  const election_options_statewide = new Array();
  const election_options_locals = new Array();
  const deduped = new Array();

  //ogl is the level of the election 
  const static_ogls = ["CCL", "LOC"];

  
  for (var i = 0; i < input.length; i++) {
    if ((input[i].page == 0) && !(election_options_statewide.includes(input[i].cnm))) {
      election_options_statewide.push(input[i].cnm);
      deduped.push(input[i]);
    }
    else if (!(input[i].page == 0) && (election_options_statewide.includes(input[i].cnm)) && (static_ogls.includes(input[i].ogl)))  {
      const x = deduped.findIndex((j) => j.cnm === input[i].cnm);
      deduped[x] = input[i];
      election_options_locals.push(input[i].cnm);
    }
    else if (!(input[i].page == 0) && !((election_options_statewide.includes(input[i].cnm)) || (election_options_locals.includes(input[i].cnm)))) {
      election_options_locals.push(input[i].cnm);
      deduped.push(input[i]); }
    else if (!((election_options_statewide.includes(input[i].cnm)) || (!(election_options_statewide.includes(input[i].cnm))))) {
      election_options_locals.push(input[i].cnm);
      deduped.push(input[i]);
    }
    else { continue; }
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

export function get_duplicates(input: any[]) {

  const election_options = new Array();
  const deduped = new Array();

  for (var i = 0; i < input.length; i++) {
    if (!(election_options.includes(input[i].cnm))) {
      election_options.push(input[i].cnm);
      deduped.push(input[i]);
  } }

  return deduped;
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

export function extremely_long_string(page: String, races: any[]) {
  const filtered_by_locale = races.filter((entry) => (entry.page == page));
  const race_list = get_duplicates(filtered_by_locale);
  const local_codes = ["CCL", "LOC"];
  let full_code = new String();
  for (let i = 0; i < race_list.length; i++) {
    if (!(local_codes.includes(race_list[i].ogl))) {
      let each_race = ` <div class="ta-results" data-page="0" data-lid="${race_list[i].lid}"></div>\n\n`;
      full_code = full_code + each_race;
    }
    else {
      let each_race = ` <div class="ta-results" data-page="${page}" data-lid="${race_list[i].lid}"></div>\n\n`;
      full_code = full_code + each_race;
    }
  }
  return full_code;
}