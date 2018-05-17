import * as readline from 'readline';
let x = new Array();

var fs = require('fs');
var fs = require('fs'),
readline = require('readline');

var rd = readline.createInterface({
    input: fs.createReadStream('./restLog0.log')
});

rd.on('line', function(line) {
    let re = /\[(.+?)\s:\s(.+?)\]/g;
    let temp;
    let record = {};
    while(temp=re.exec(line)){
        switch(temp[1]){
            case 'EXECTIME':
              record['EXECTIME']= parseFloat(temp[2]);
              break;
            case 'STATUSCODE':
              record['STATUSCODE']= parseInt(temp[2]);
            default:
              record[temp[1]]=temp[2]
        }
    }
    x.push(record);
});

let cmds =new function(){
    this.filter = (line) =>{
        return x.filter((item)=>{
            let {ECID, USER, PATH, AGENT, ACTION, DATE, SERVERNAME ,CONTENTLENGTH, DATA, STATUSCODE, PERFFLAG, RESTFRAMEWORKVERSION, ERRORINFO, EXECTIME} = item;
            let result = null;
            try { result = eval(line)}
            catch(err){return null}
            return result;
        });
    };
    this.count = (line)=>this.filter(line).length;
}();

let main= () => {
    let rl = readline.createInterface(process.stdin, process.stdout);
    let currentCommand = '>>';
    rl.setPrompt(currentCommand);
    rl.prompt();
    rl.on('line', (line)=> {
        if (line === "exit") rl.close();
        else if(line === 'count') currentCommand = 'count'
        else if(line === 'filter') currentCommand = 'filter'
        else if(line !== ''){
            if(currentCommand==='count' || currentCommand==='filter')
            console.log(cmds[currentCommand](line));
        }
    if(currentCommand!=='>>')
    rl.setPrompt(currentCommand+'>>');
    rl.prompt();
    }).on('close',()=>{process.exit(0);});
}
main();
