import React from 'react'
import { Link } from 'react-router-dom'

function PageNotFound() {
    return (
        <div style={{
            display: 'flex',
            width: '100%',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <h1>Page not Found :/</h1>
            <h3>
                <Link to='/'>Home page</Link>
            </h3>
        </div>
    )
}

export default PageNotFound
