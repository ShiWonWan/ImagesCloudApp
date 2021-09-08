import { useEffect, useState, Fragment } from 'react'
import { Navbar, Container, Button, Nav } from 'react-bootstrap'
import jwt_decode from 'jwt-decode'
import { useHistory, Link } from 'react-router-dom'


export const NavBar = (props) => {

    const [userName, setUserName] = useState('')
    const [name, setName] = useState('')

    const history = useHistory()

    useEffect(() => {
        if (props.logged === true) {
            var token = localStorage.getItem('token')
            var decoded = jwt_decode(token)
            setName(decoded.name)
            setUserName(decoded.user)
        }
    }, [])

    const LogOut = () => {history.push('./'); localStorage.setItem('logged', false)}
    const SignIn = () => history.push('/login')
    const SignUp = () => history.push('/register')

    return (
        <Fragment>
            {props.logged === true ?
                <Navbar>
                    <Container>
                        <Link to='/'><Navbar.Brand>"Cool App Name"</Navbar.Brand></Link>
                        <Navbar.Toggle />
                        <Navbar.Collapse className="justify-content-center">
                            <Navbar.Text>
                                Signed in as: <strong>{name}</strong> ({userName})
                            </Navbar.Text>
                        </Navbar.Collapse>
                        <Button onClick={LogOut} variant='outline-primary' >Log Out</Button>
                    </Container>
                </Navbar>
                :
                <Navbar>
                    <Container>
                        <Link to='/'><Navbar.Brand>"Cool App Name"</Navbar.Brand></Link>
                        <Navbar.Toggle />
                        <Nav className="justify-content-end">
                            <Nav.Link><Button onClick={SignIn} variant='outline-primary'>Sign In</Button></Nav.Link>
                            <Nav.Link><Button onClick={SignUp} variant='outline-primary' >Sign Up</Button></Nav.Link>
                            
                        </Nav>

                    </Container>
                </Navbar>
            }
        </Fragment>
    )
}