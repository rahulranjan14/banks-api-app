import React from 'react'

import './banks.css'

const Banks = ({ banks, loading, addValue }) => {

    

    if(loading){
        return(
            <h1>Loading...</h1>
        )
    }
    
    return(
        <>

            <table>
                <tr>
                    <th>IFSC</th>
                    <th>Bank Id</th>
                    <th>Branch</th>
                    <th>Address</th>
                    <th>City</th>
                    <th>District</th>
                    <th>State</th>
                    <th>Name</th>
                    <th>Save</th>
                </tr>

                {banks &&  banks.map(bank => (
                    <tr>
                        <td><p className="cellFont">{bank.ifsc}</p></td>
                        <td><p className="cellFont">{bank.bank_id}</p></td>
                        <td><p className="cellFont">{bank.branch}</p></td>
                        <td><p className="cellFont">{bank.address}</p></td>
                        <td><p className="cellFont">{bank.city}</p></td>
                        <td><p className="cellFont">{bank.district}</p></td>
                        <td><p className="cellFont">{bank.state}</p></td>
                        <td><p className="cellFont">{bank.bank_name}</p></td>
                        <td style={{ textAlign:'center'}}><button onClick={() => addValue(bank)}>Save</button></td>
                    </tr>
                )
                )}

                
            </table>


            
        </>
    )
}

export default Banks;