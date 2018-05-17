"use strict";
exports.__esModule = true;
var x = new Array();
var fs = require('fs');
var fs = require('fs'), readline = require('readline');
var rd = readline.createInterface({
    input: fs.createReadStream('./restLog0.log')
});
rd.on('line', function (line) {
    var re = /\[(.+?)\s:\s(.+?)\]/g;
    var temp;
    var record = {};
    while (temp = re.exec(line)) {
        switch (temp[1]) {
            case 'EXECTIME':
                record['EXECTIME'] = parseFloat(temp[2]);
                break;
            case 'STATUSCODE':
                record['STATUSCODE'] = parseInt(temp[2]);
            default:
                record[temp[1]] = temp[2];
        }
    }
    x.push(record);
});
var cmds = new function () {
    var _this = this;
    this.filter = function (line) {
        return x.filter(function (item) {
            var ECID = item.ECID, USER = item.USER, PATH = item.PATH, AGENT = item.AGENT, ACTION = item.ACTION, DATE = item.DATE, SERVERNAME = item.SERVERNAME, CONTENTLENGTH = item.CONTENTLENGTH, DATA = item.DATA, STATUSCODE = item.STATUSCODE, PERFFLAG = item.PERFFLAG, RESTFRAMEWORKVERSION = item.RESTFRAMEWORKVERSION, ERRORINFO = item.ERRORINFO, EXECTIME = item.EXECTIME;
            var result = null;
            try {
                result = eval(line);
            }
            catch (err) {
                return null;
            }
            return result;
        });
    };
    this.count = function (line) { return _this.filter(line).length; };
}();
var main = function () {
    var rl = readline.createInterface(process.stdin, process.stdout);
    var currentCommand = '>>';
    rl.setPrompt(currentCommand);
    rl.prompt();
    rl.on('line', function (line) {
        if (line === "exit")
            rl.close();
        else if (line === 'count')
            currentCommand = 'count';
        else if (line === 'filter')
            currentCommand = 'filter';
        else if (line !== '') {
            if (currentCommand === 'count' || currentCommand === 'filter')
                console.log(cmds[currentCommand](line));
        }
        if (currentCommand !== '>>')
            rl.setPrompt(currentCommand + '>>');
        rl.prompt();
    }).on('close', function () { process.exit(0); });
};
main();
