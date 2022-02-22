import React, { useEffect, useState } from "react";
import Web3 from "web3";
import "./App.css";
import Navbar from "./components/Navbar";
import Table from "./components/Table";
import Election from "./contracts/Election.json";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
// import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import swal from 'sweetalert';





const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const App = () => {
  //all the UI
  // input value
  const classes = useStyles();
  const [chooseid, setChooseid] = useState("");

  const handleChange = (e) => {
    setChooseid(e.target.value);
  };
  const [refresh, setrefresh] = useState(0);
  //input value

  //things realted to web3
  let content;
  const [loading2, setloading2] = useState(false);
  const [account, setAccount] = useState("");
  
  
  const [loading, setLoading] = useState(true);
  const [Hello, setHello] = useState({});

  //states related to electioncontract
  const [Electioncontract, setElectioncontract] = useState();
  const [contractowner, setContractowner] = useState("");
  const [voted, setVoted] = useState(false);
  const [showlead, setShowLead] = useState(false);
  const [Destinations, setDestinations] = useState([]);
  const [candidateAddress, setCandidateAddress] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [leading, setLeading] = useState([]);

  const loadWeb3 = async () => {
    if (window.ethereum) {
      await window.ethereum.enable();
    } else {
      
      swal("Non-Ethereum browser detected", "You should consider trying MetaMask! ", "info")
    }
  };
useEffect(() => {
    loadWeb3();
    loadBlockchainData();

    if (refresh == 1) {
      setrefresh(0);
      loadBlockchainData();
    }
    //esl
  }, [refresh]);
  useEffect(() => {
    setDestinations([]);
  }, []);
  let selectedAccount;
  let addressAccount;

  const loadBlockchainData = async () => {
    setLoading(true);
    if (typeof window.ethereum == "undefined") {
      return;
    }
    let provider = window.ethereum;
    setLoading(true);
    if (typeof provider !== 'undefined') {
      provider
        .request({ method: 'eth_requestAccounts' })
        .then((accounts) => {
          selectedAccount = accounts[0];
          addressAccount = web3.utils.toChecksumAddress(selectedAccount);
          setAccount(selectedAccount);
          setCandidateAddress(addressAccount)
          console.log(`Selected account is $`,account);
        })
        .catch((err) => {
          console.log(err);
          return;
        });
        window.ethereum.on('accountsChanged', function (accounts) {
          selectedAccount = accounts[0];
          addressAccount = web3.utils.toChecksumAddress(selectedAccount);
          setAccount(selectedAccount);
          console.log(`Selected account changed to `,account);
        });
      }
    const web3 = new Web3(provider);
    console.log(window.ethereum);

    let url = window.location.href;
    console.log(url);

    
    const networkId = await web3.eth.net.getId();
    console.log("aaa",networkId);

    if (networkId === 1337|| 42) {
      console.log("gg",networkId);
      // const hello = new web3.eth.Contract(Helloabi.abi, networkData.address);
      
      const electionContract =  new web3.eth.Contract(
        Election.abi,
        "0x929696B39b7C359d2fbbEc98bc6861FdA7bf5A72"
      );
      console.log("fff",electionContract);

       setElectioncontract(electionContract);
      console.log("dd",Electioncontract);
      const owner = await electionContract.methods.contractOwner().call();
      console.log("ss",owner);
      setContractowner(owner);
      console.log("daz",candidateAddress);
     
      const vote = await electionContract.methods.voters(addressAccount).call();
      console.log(vote);
      setVoted(vote);

      var x = await electionContract.methods.destination_count().call();
      var arr = [];

      for (var i = 0; i < x; i++) {
        await electionContract.methods
          .Destinations(i)
          .call()
          .then((destination) => {
            arr = [
              ...arr,
              { id: i + 1, name: destination[0], votes: destination[1] },
            ];
          });
              }
      console.log(arr);
      setDestinations(arr);

      setLoading(false);
    } else {
      
      swal("", "the contract not deployed to detected network ", "error");
   
      console.log(window.ethereum);
      setloading2(true);
    }
  };

  

  const walletAddress = async () => {
    await window.ethereum.request({
      method: "eth_requestAccounts",
      params: [
        {
          eth_accounts: {},
        },
      ],
    });
    window.location.reload();
  };

  

  

  const givevote = async () => {
    try {
      let ChoiceId = chooseid - 1;
      await Electioncontract.methods
        .add_vote(ChoiceId)
        .send({ from: account })
        .then((a) => {
          swal("success!", "THANK YOU FOR YOUR VOTE", "success");
          let id_returned = a.events.Voted.returnValues.id;
         
          console.log(id_returned);
          // Destinations = Destinations.map((destination => {
          //   if (destination.id === id_returned+1) {
          //     destination.votes = destination.votes + 1;
          //   }
          //   return destination;
          // }))
        });
       // setDestinations(Destinations);
      setVoted(!voted);
    } catch (err) {
     console.log(err);
    if (err.code == 4001){
      swal("", err.message, "error");
    }else{
      swal("", "You have already voted ", "error");}
    }
  };
  if (loading === true) {
    content = (
      <div className="text-center">
        Loading...{loading2 ? <div>loading....</div> : ""}
        
      </div>
    );
  } else {
    content = (
      <div className="app">
        <div className="table">
          <Table Destinations={Destinations} />
        </div>
        <div>{!voted &&<div>
        <div className="do_vote" >
          <h3>Select a destination and click the "VOTE" button</h3>
        </div>
        
        <div className="input_id">
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-label">Select ID</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={chooseid}
              onChange={handleChange}
            >
              {
                Destinations.length !== 0 ? (
                  Destinations.map((destination) => (
                    <MenuItem key={destination.name} value={destination.id}>
                      {destination.id}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value={0}>No destination</MenuItem>
                )
                // generateMenuItem()
              }
            </Select>
          </FormControl>
          <Button disabled={!chooseid}variant="contained" onClick={givevote}>
            VOTE
          </Button>
        </div>
        </div>
        }
        </div>
        <div>
        
      
    </div>
        <div className="after_voting">
          {voted && <h6>THANK YOU FOR YOUR VOTE</h6>}
        </div>
        <div className="showinguser_address">
          <h4>Your Address: {account}</h4>
        </div>
        <hr className="news1" />
       
      </div>
    );
  }
  // result={result}
  return (
    <div>
      <Navbar account={contractowner} />

      {account == "" ? (
        <div className="container">
          {" "}
          Connect your wallet to application{"   "}{" "}
          <button onClick={walletAddress}>metamask</button>
        </div>
      ) : (
        content
      )}
      {/* {content} */}
    </div>
  );
};

export default App;
