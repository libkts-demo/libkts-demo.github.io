let addbox = function(row, text, title) { return _addbox('td', row, text, title); }
let addboxh = function(row, text, title) { return _addbox('th', row, text, title); }

const dummyInput = document.createElement('input');
dummyInput.type = 'file';
dummyInput.accept = '.Tournament';
dummyInput.addEventListener('change', async () =>
{
    const nameDiv = document.getElementById('name');
    const infoDiv = document.getElementById('info');
    const outputTable = document.getElementById('players');
    while (outputTable.lastElementChild)
        outputTable.removeChild(outputTable.lastElementChild);
    
    if (!dummyInput.files.length) return;
    const file = dummyInput.files[0];
    const fileName = file.name;
    const fileText = await file.text();
    
    let tournament;
    try
    {
        tournament = window.LibKTS.Parse(fileText);
        console.log('Tournament data loaded successfully.')
        console.log(tournament);
    } catch (e) {
        console.warn('Failed to load:',e);
        nameDiv.innerText = 'Failed to load tournament';
        infoDiv.innerText = (''+e);
        return;
    }
    
    nameDiv.innerText = tournament.id+' - "'+tournament.name+'"';
    infoDiv.innerText = (
        tournament.tournamentStyle.label+' - '+
        tournament.playerStructure.label+' - '+
        tournament.tournamentStructure.label+'\n'+
        tournament.entrants.active.length+'/'+tournament.entrants.all.length+' active entrant(s) - '+
        tournament.matches.ongoing.length+' match(es) ongoing'
    );

    const header = document.createElement('tr');
    outputTable.appendChild(header);
    addboxh(header, '#');
    addboxh(header, 'Name');
    addboxh(header, 'Score');
    addboxh(header, 'Points');
    addboxh(header, 'Tie1');
    addboxh(header, 'Tie2');
    
    let rows = [];
    for (const entrant of tournament.entrants.all)
    {
        const {wins, losses, draws} = entrant.record.all;
        const row = document.createElement('tr');
        addbox(row, entrant.rank);
        addbox(row, entrant.name);
        addbox(row, wins+'-'+losses+'-'+draws);
        addbox(row, entrant.record.swiss.points);
        addbox(row, (entrant.record.swiss.tiebreakers[0]*100).toFixed(1)+'%');
        addbox(row, (entrant.record.swiss.tiebreakers[1]*100).toFixed(1)+'%');
        
        if (entrant.dropped)
            row.classList.add('dropped');
        
        row.rank = entrant.rank;
        rows.push(row);
    }
    
    rows.sort((a,b) => (a.rank - b.rank));
    outputTable.append(...rows);
});

document.getElementById('load-box').addEventListener('click', () =>
{
    dummyInput.value = '';
    dummyInput.click();
});

let _addbox = function(elm, row, text, title)
{
    const td = document.createElement(elm);
    td.innerText = text;
    if (title) td.title = title;
    row.appendChild(td);
    return td;
}
