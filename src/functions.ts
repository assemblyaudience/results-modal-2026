
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
    const filtered_array = get_duplicates(new_array);
    return filtered_array;

}

function get_duplicates(input: any[]) {
  // The bifurcation between statewide and local elections accounts for the fact
  // that we want to grab some of the local elections from the statewide page
  // because they cross counties. But, we still want
  // them to show up on the local page. 
  const election_options_statewide = new Array();
  const election_options_locals = new Array();
  const deduped = new Array();

  //ogl is the level of the election 
  const static_ogls = ["fed", "nch", "ncs", "jud"]

  
  for (var i = 0; i < input.length; i++) {
     if (!(input[i].page == 0) && (election_options_statewide.includes(input[i].lid)) && !(static_ogls.includes(input[i].ogl)))  {
      const x = deduped.findIndex((j) => j.lid === input[i].lid);
      deduped[x].page = input[i].page;
    }
    else if ((input[i].page == 0) && !(election_options_statewide.includes(input[i].lid))) {
      console.log("got to this step");
      election_options_statewide.push(input[i].lid);
      deduped.push(input[i]);
    }
    else if (!(input[i].page == 0) && !((election_options_statewide.includes(input[i].lid)) || (election_options_locals.includes(input[i].lid)))) {
      election_options_locals.push(input[i].lid);
      deduped.push(input[i]);
    }
    else { continue; }
  }
  console.log(input.length);
  console.log(election_options_statewide.length);
  console.log(election_options_locals.length);
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

export function extremely_long_string(page: String, races: any[]) {
  const filtered_by_locale = races.filter((entry) => (entry.page == page));
  let full_code = new String();
  for (let i = 0; i < filtered_by_locale.length; i++) {
    let each_race = ` <div class="ta-results" data-page="${page}" data-lid="${filtered_by_locale[i].lid}"></div>\n\n`;
    full_code = full_code + each_race;
  }
  return full_code;
}