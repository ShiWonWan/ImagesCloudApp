import { useState, Fragment } from 'react'
import { Form, Button, Container, Row } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'

import { NavBar } from './Navbar'

export const Login = () => {

    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')

    const history = useHistory()

    const handleDoneSubmit = () => {
        history.push('/user+gallery')
    }

    const handeSubmit = async (e) => {
        e.preventDefault()

        const reponse = await fetch(`${process.env.REACT_APP_URL_API}/user/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'password': password,
                'user': userName
            })
        })
        const json = await reponse.json()
        if (reponse.status === 200) {
            alert('User successfully logged in.')
            localStorage.setItem('token', json['token'])
            localStorage.setItem('logged', true)
            handleDoneSubmit()
        } else {
            alert('User and/or password incorrect.')
         }

        setUserName('')
        setPassword('')
        e.target.reset()
    }

    return (
        <Fragment>
            <NavBar />
            <Container>
                <Row className="justify-content-md-center">
                    <Form className="w-50 p-3" onSubmit={handeSubmit}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text" placeholder="Enter username" value={userName} onChange={e => setUserName(e.target.value)} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Sign In
                        </Button>
                    </Form>
                </Row>
            </Container>
        </Fragment>

    )

}






export const Register = () => {

    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')

    const history = useHistory()

    const handleDoneSubmit = () => {
        history.push('/login')
    }

    const handeSubmit = async (e) => {
        e.preventDefault()

        const reponse = await fetch(`${process.env.REACT_APP_URL_API}/user/new`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'password': password,
                'user': userName,
                'name': name
            })
        })
        if (reponse.status === 200) {
            alert('User successfully registered.')
            handleDoneSubmit()
        } else {
            alert('User exists or 1 or more than 1 value is missing')
          }

        setUserName('')
        setPassword('')
        setName('')
        e.target.reset()
    }

    return (
        <Fragment>
            <NavBar />
            <Container>
                <Row className="justify-content-md-center">
                    <Form className="w-50 p-3" onSubmit={handeSubmit}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>User</Form.Label>
                            <Form.Control type="text" placeholder="Enter username" value={userName} onChange={e => setUserName(e.target.value)} />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter name" value={name} onChange={e => setName(e.target.value)} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                        </Form.Group>



                        <Button variant="primary" type="submit">
                            Sign Up
                        </Button>
                    </Form>
                </Row>
            </Container>
        </Fragment>

    )

}