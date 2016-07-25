/**********************************************************************
* 
* code_exec.js: recebe um código em BIRL, uma entrada padrão e um valor
* de resposta, cria o arquivo .c equivalente ao código BIRL, compila e
* o executa.
*
***********************************************************************/
var crypto = require('crypto');

// Cria um valor hexadecimal com tamanho len
function randomValueHex (len) {
    return crypto.randomBytes(Math.ceil(len/2))
        .toString('hex');
        .slice(0,len);
};


module.exports = function (bCode, stdin, res) {
  //Criando o arquivo .c com nome aleatório
  const code = require('./birlToC.js')(bCode);
  const fs = require('fs');
  const comp = require('./compiler.js');
  var rName = randomValueHex(15).toString();

  fs.writeFile(rName + ".c", code, function (err) {
    // se ocorrer erro, retorna pela res
    if (err) {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error:  "ERRO INTERNO CUMPADI\n" }));
      return;
    }

    // caso contrário, compila e executa
    process.nextTick(function () {
      comp(rName, stdin, res);
    });
  });
};