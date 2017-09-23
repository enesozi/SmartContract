var Web3 = require('web3');
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));
if (!web3.isConnected()) {
    console.log("not	connected");
}
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
//	Create	application/x-www-form-urlencoded	parser

app.use(bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.use(cors());
function retlatestblock() {
    var latbno = web3.eth.blockNumber;
    var block;
    latbno = web3.eth.blockNumber;
    block = web3.eth.getBlock(latbno);
    return (block);
}

var abi = [
   {
      "constant":true,
      "inputs":[

      ],
      "name":"customer",
      "outputs":[
         {
            "name":"customerAccount",
            "type":"address"
         },
         {
            "name":"balance",
            "type":"uint256"
         }
      ],
      "payable":false,
      "stateMutability":"view",
      "type":"function"
   },
   {
      "constant":false,
      "inputs":[
         {
            "name":"bankAddr",
            "type":"address"
         },
         {
            "name":"name",
            "type":"bytes32"
         },
         {
            "name":"amountToPay",
            "type":"uint256"
         }
      ],
      "name":"createReceipt",
      "outputs":[

      ],
      "payable":true,
      "stateMutability":"payable",
      "type":"function"
   },
   {
      "constant":true,
      "inputs":[
         {
            "name":"",
            "type":"uint256"
         }
      ],
      "name":"bonds",
      "outputs":[
         {
            "name":"code",
            "type":"bytes32"
         },
         {
            "name":"value",
            "type":"uint256"
         }
      ],
      "payable":false,
      "stateMutability":"view",
      "type":"function"
   },
   {
      "constant":true,
      "inputs":[

      ],
      "name":"bond",
      "outputs":[
         {
            "name":"code",
            "type":"bytes32"
         },
         {
            "name":"value",
            "type":"uint256"
         }
      ],
      "payable":false,
      "stateMutability":"view",
      "type":"function"
   },
   {
      "constant":true,
      "inputs":[

      ],
      "name":"payInsurance",
      "outputs":[
         {
            "name":"enoughBalance",
            "type":"bool"
         }
      ],
      "payable":false,
      "stateMutability":"view",
      "type":"function"
   },
   {
      "constant":true,
      "inputs":[

      ],
      "name":"bank",
      "outputs":[
         {
            "name":"bankAccount",
            "type":"address"
         },
         {
            "name":"balance",
            "type":"uint256"
         }
      ],
      "payable":false,
      "stateMutability":"view",
      "type":"function"
   },
   {
      "constant":true,
      "inputs":[
         {
            "name":"",
            "type":"uint256"
         }
      ],
      "name":"payments",
      "outputs":[
         {
            "name":"customerAddress",
            "type":"address"
         },
         {
            "name":"bankAddress",
            "type":"address"
         },
         {
            "name":"bondName",
            "type":"bytes32"
         },
         {
            "name":"customerPayment",
            "type":"uint256"
         }
      ],
      "payable":false,
      "stateMutability":"view",
      "type":"function"
   },
   {
      "constant":true,
      "inputs":[

      ],
      "name":"Owner",
      "outputs":[
         {
            "name":"",
            "type":"address"
         }
      ],
      "payable":false,
      "stateMutability":"view",
      "type":"function"
   },
   {
      "constant":true,
      "inputs":[

      ],
      "name":"getOneOfcustomerReceipt",
      "outputs":[
         {
            "name":"indexOfReceipt",
            "type":"uint256"
         }
      ],
      "payable":false,
      "stateMutability":"view",
      "type":"function"
   },
   {
      "constant":true,
      "inputs":[

      ],
      "name":"getHighestPaymentReceipt",
      "outputs":[
         {
            "name":"indexOfReceipt",
            "type":"uint256"
         }
      ],
      "payable":false,
      "stateMutability":"view",
      "type":"function"
   },
   {
      "constant":false,
      "inputs":[
         {
            "name":"bankAddr",
            "type":"address"
         },
         {
            "name":"name",
            "type":"bytes32"
         }
      ],
      "name":"cancelBond",
      "outputs":[

      ],
      "payable":true,
      "stateMutability":"payable",
      "type":"function"
   },
   {
      "inputs":[

      ],
      "payable":false,
      "stateMutability":"nonpayable",
      "type":"constructor"
   }
];

var contractaddress = "0xc85935316cd7efe4d313a3427c2d25b4c02430e2" ;

var contract = web3.eth.contract(abi).at(contractaddress);

// Returns balance of given address
function retbalance(addr) {
  var balance= web3.fromWei(web3.eth.getBalance(addr));
  return (balance);
}

function getBond(code){
  return contract.bonds(addr);
}

// Get receipt info at given index.
function receipts(index){
  return contract.payments.call(index);
}

// Buys insurance for given address.
function buyInsurance(fromaddr,password,value){
  web3.personal.unlockAccount(fromaddr,password,5);
  contract.payInsurance({from:	fromaddr,value:web3.toWei(value, "ether"),	gas:300000});
}

function createReceipt(fromaddr,password,bankAddress,amountToPay){
  if(web3.personal.unlockAccount(fromaddr,password,5)){
    contract.createReceipt(bankAddress,amountToPay,{from:	fromaddr,value:web3.toWei(amountToPay, "ether"),	gas:300000})
  }
}

app.use(express.static('.'));

// Give Hospital info.
app.get('/API/hospital', function(req, res) {
    var info=getHospital(req.query.addr);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(info));
});

// Buys insurance for patient.
app.post('/API/buyInsurance', function(req, res) {
    buyInsurance(req.body.addr,req.body.pw);
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify("it will be done at next block."));
});

// For hospital to create receipt.
app.post('/API/createReceipt', function(req, res) {
    createReceipt(req.body.addr,req.body.pw,req.body.patientAddress,parseInt(req.body.amountToPay,10),parseInt(req.body.auditorsPayment,10));
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify("it will be done at next block."));
});


app.get('/getlatestblock', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    var rblock = retlatestblock();
    res.send(JSON.stringify(rblock));
});

// Gets balance of given addr.
app.get('/getbalance/:addr', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    var bal = retbalance(req.params["addr"]);
    res.send(JSON.stringify(bal));
});

var server = app.listen(8081, function() {
    var host = server.address().address
    var port = server.address().port
    console.log("Example	app	listening	at	http://%s:%s", host, port)
});
