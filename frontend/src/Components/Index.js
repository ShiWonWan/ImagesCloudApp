import { Fragment, useEffect } from 'react'

import { useHistory } from 'react-router'
import { NavBar } from './Navbar'

import dancingNed from '../resources/Images/dancer_ned.gif'

export const Index = () => {

    const history = useHistory()

    useEffect(() => {
        if (localStorage.getItem('logged') === true){
            history.push('/user+gallery')
        }
        // eslint-disable-next-line
    }, [])

    return (
        <Fragment>
            <NavBar />
            <h1 className="text-center text-primary">Welcome to "Insert cool app name"</h1> <br />
            <h2 className="p-3 text-secondary text-center">Here you can upload your photos, and download them whenever you want.</h2>
            <div className="text-center">
                <img src={dancingNed} alt="Ned dancing happy" />
            </div>
        </Fragment>
    )

}