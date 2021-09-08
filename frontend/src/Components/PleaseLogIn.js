import { Fragment } from 'react'
import iSeeYou from '../resources/Images/seeyou.jpg'
import { Button } from 'react-bootstrap'
import { useHistory } from 'react-router'

export const PleaseLogIn = () => {

    const history = useHistory()

    const goHome = () => history.push('/')

    return (
        <Fragment>
            <div className="text-center">
                <br /><br /><br />
                <h1>Please login first.</h1>
                <img src={iSeeYou} alt="I see you lol" /> <br />
                <Button onClick={goHome}>Go Home</Button>
            </div>
        </Fragment>
    )
}