import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'

import { Container, Row, Col } from 'react-bootstrap';
import { Form, FormGroup,  Input } from "reactstrap"
import Select from 'react-select';

import './App.css';

import Banks from './components/Banks'
import SavedBanksComponent from './components/SavedBanksComponent'
import Pagination from './components/Pagination'



//city options
const options = [
  {value: 'MUMBAI', label: 'MUMBAI'},
  {value: 'PUNE', label: 'PUNE'},
  {value: 'DELHI', label: 'DELHI'},
  {value: 'BANGALORE', label: 'BANGALORE'},
  {value: 'KOLKATA', label: 'KOLKATA'},
]

//no of page options
const pageOptions = [
  {value: 1, label: '1'},
  {value: 3, label: '3'},
  {value: 5, label: '5'},
  {value: 10, label: '10'},
  {value: 15, label: '15'},
  {value: 20, label: '20'},
  {value: 25, label: '25'},
  {value: 50, label: '50'},
  {value: 75, label: '75'},
  {value: 100, label: '100'},
  {value: 200, label: '200'},
  {value: 500, label: '500'},
  {value: 1000, label: '1000'},
]

const App = () => {

  const [selectedOption, setSelectedOption] = useState({value: 'MUMBAI', label: 'MUMBAI'})
  const [selectedPageNumber, setSelectedPageNumber] = useState({value: 10, label: '10'})

  const [searchString, setSearchString] = useState("")

  const [loading, setLoading] = useState(false)

  const [banks, setBanks] = useState([])
  const [searchedBanks, setSearchedBanks] = useState([])
  const [savedBanks, setSavedBanks] = useState([])

  const [currentPage, setCurrentPage] = useState(1)
  const [banksPerPage, setBanksPerPage] = useState(10)


  //to get banks stored in localstorage
  useEffect(() => {
    const localSavedBanks = localStorage.getItem("savedBanksLocally")
    console.log({localStorage});
    if (localSavedBanks){
      setSavedBanks(JSON.parse(localSavedBanks))
    }
  },[])

  //to add banks to localstorage
  const addBanks = async bank => {
    setSavedBanks([...savedBanks, bank])
  }

  //to remove banks from localstorage
  const removeBanks = ifsc => {
    setSavedBanks(savedBanks.filter(bank => bank.ifsc !== ifsc))
  }

  //to update the saved banks component whenever there is any update in savedbank array
  useEffect(() => {
    localStorage.setItem("savedBanksLocally", JSON.stringify(savedBanks))
  },[savedBanks])

  //to handle changing of cities
  const handleChange = selectedOption => {
    setSelectedOption(selectedOption)
    console.log(selectedOption)
    setSearchString("")
  }

  //to handle number of banks to display per page(pagination)
  const handlePageChange = selectedPageNumber => {
    setSelectedPageNumber(selectedPageNumber)
    const temp = selectedPageNumber.value;
    setBanksPerPage(temp)
    console.log("banks perpage",banksPerPage)
  }

  //to fetch data from api
  const fetchData = async (selectedOption) => {
    const city = selectedOption.value;
    setLoading(true)
    const result = await axios.get(
      `https://vast-shore-74260.herokuapp.com/banks?city=${city}`
    )
    console.table(result.data)
    setBanks(result.data)
    console.log("banks",banks)
    setLoading(false)
    fillSearchedBanks(searchString)
  }


  //function to filter banks while searching
  const fillSearchedBanks = (searchString) => {
    const searchStringLocal = searchString;

    const banksSearched = [];

    for (let i = 0; i < banks.length; i++) {
      const element = banks[i];
      if (  element.ifsc.includes(searchStringLocal)  ||  
            element.bank_id.toString().includes(searchStringLocal) ||
            element.branch.includes(searchStringLocal) ||
            element.address.includes(searchStringLocal) ||
            element.city.includes(searchStringLocal) ||
            element.district.includes(searchStringLocal) ||
            element.state.includes(searchStringLocal) ||
            element.bank_name.includes(searchStringLocal) 
      ){
        banksSearched.push(element)
      }
    }

    setSearchedBanks(banksSearched)
    console.log("banks searched here", searchedBanks)
  }

  //to call the function for getting banks on the basis of city
  useEffect(() => {
    
    fetchData(selectedOption)
    
  },[selectedOption])


  //to call the function for getting banks while searching
  useEffect(() => {
    fillSearchedBanks(searchString)
  },[searchString])


  //for pagination
  const lastBankIndex = currentPage * banksPerPage
  const firstBankIndex = lastBankIndex - banksPerPage
  const currentBanks = banks.slice(firstBankIndex, lastBankIndex)
  const searchedCurrentBanks = searchedBanks.slice(firstBankIndex, lastBankIndex)

  // const savedCurrentBanks = savedBanks.slice(firstBankIndex, lastBankIndex)

  

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  //for showing banks initially
  const showDefaultBanks = (searchString) => {
    if(searchString == ""){
      return(
        <>
        <h3>All Banks</h3>
        <Banks banks={currentBanks} loading={loading} addValue={addBanks}/>

        <Container>
          <Row>
            <Pagination banksPerPage={banksPerPage} totalBanks={banks.length} paginate={paginate} loading={loading} />
          </Row>
        </Container>
        </>
      )
    }
  }

  //for showing banks while searching
  const showSearchedBanks = (searchString) => {
    if(searchString !== ""){
      return(
        <>
        <Banks banks={searchedCurrentBanks} loading={loading} addValue={addBanks} />
        <Container>
          <Row>
            <Pagination banksPerPage={banksPerPage} totalBanks={searchedBanks.length} paginate={paginate} loading={loading} />
          </Row>
        </Container> 
        </>
      )
    }
  }

  // for showing banks which are saved in localstorage
  const showSavedBanks = () => {
    if(savedBanks.length != 0 && searchString == ""){
      return(
        <>
          <h3>Saved Banks</h3> 
          <SavedBanksComponent banks={savedBanks} loading={loading} removeValue={removeBanks} />
         
        </>
      )
    }
  }

 

  return (
    <div className="App">
    
      <h1>Bank App</h1>

      <Container fluid>
      
        <Container>
          <Row style={{marginTop:75, marginBottom:50}}>
        
            <Col xs={{order:1, span:1}} md={{order:1,span:1}}></Col>
          
            <Col xs={{order:2, span:3}} md={{order:2,span:3}}>
            <Select 
            placeholder="Select City"
            value={selectedOption}
            onChange={handleChange}
            options={options}
            defaultValue='PUNE'
            />
            </Col>

            <Col xs={{order:3, span:5}} md={{order:3,span:5}}>
          
              <Form>
                <FormGroup row>
                  <Col>
                    <Input
                      type='text'
                      name='search'
                      id='search'
                      placeholder='Search'
                      value={searchString}
                      onChange={e => setSearchString(e.target.value)}
                    />
                  </Col>
                </FormGroup>
              </Form>  

            </Col>

            <Col xs={{order:4, span:2}} md={{order:4,span:2}}>
               <Form>
                <FormGroup row>
                  <Col>
                    
                    <Select 
                      placeholder="Select page"
                      value={selectedPageNumber}
                      onChange={handlePageChange}
                      options={pageOptions}
                      
                    />
                  </Col>
                </FormGroup>
              </Form>
            </Col>


            <Col xs={{order:5, span:3}} md={{order:5,span:3}}></Col>
          </Row>

        </Container>

        <div className="containerSavedBanks">
        {showSavedBanks()}
        </div>

        <div className="containerAllBanks">
        {showDefaultBanks(searchString)}
        </div>

        <div className="containerSearchedBanks">
        {showSearchedBanks(searchString)}
        </div>
        
      </Container>

  
    </div>
  );
}

export default App;
