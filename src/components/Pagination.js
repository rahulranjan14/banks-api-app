import React from 'react'
import { Container, Row, Col } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import { Link } from 'react-router-dom'

import './pagination.css'

const Pagination = ({banksPerPage, totalBanks, paginate, loading}) => {
    const pageNumbers = []

    for (let i = 1; i < Math.ceil( totalBanks/banksPerPage ); i++) {
        pageNumbers.push(i)
    }

    if(loading){
        return(
           <>
           </>
        )
    }

    return(
        <Container fluid>
            <Container>
                <Row className="paginationOverflow">
                    <Col>
                        <nav>
                            <ul className='pagination'>
                                {pageNumbers.map(number => (
                                    <li key={number} className="page-item">
                                        <Link onClick={() => paginate(number)} to="/bankapiapp" className="page-link">{number}</Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </Col>
                </Row>
            </Container>
        </Container>
    )
}

export default Pagination;