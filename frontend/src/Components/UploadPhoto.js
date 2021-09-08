import { useState, useEffect, Fragment } from 'react'
import { Form, Button } from 'react-bootstrap'
import jwt_decode from 'jwt-decode'

import { NavBar } from './Navbar'

export const UploadPhoto = (props) => {
    const [selectedFile, setSelectedFile] = useState()
    const [isFilePicked, setIsFilePicked] = useState(false)
    const [id, setId] = useState()


    useEffect(() => {
        var token = localStorage.getItem('token')
        var decoded = jwt_decode(token)
        setId(decoded['id'])
    }, [])

    const changeHandler = (event) => {
        setSelectedFile(event.target.files[0]);
        setIsFilePicked(true);
    }

    const handleSubmission = async () => {
        const formData = new FormData();

        formData.append('file', selectedFile)
        formData.append('id', id)

        await fetch(
            `${process.env.REACT_APP_URL_API}/upload`,
            {
                method: 'POST',
                body: formData,
            }
        )
            .then((response) => response.json())
            .then((result) => {
                console.log(result);
                if (result['ERROR'] === 'File needed') {
                    alert('File needed.')
                } else if (result['ERROR'] === 'Incorrect name') {
                    alert('Incorrect name')
                }
            })
            .catch((error) => {
                console.error('Error:', error);
            })
        props.getPhotos()
        setIsFilePicked(false)
        setSelectedFile(null)
    }


    return (
        <Fragment>
            <NavBar logged={true} />
            <div className="photo-uploader text-center">
                <Form.Group controlId="formFile" className="mb-3 p-3">
                    {isFilePicked ? (
                        <div>
                            <p>Filename: {selectedFile.name}</p>
                            <p>Filetype: {selectedFile.type}</p>
                            <p>Size in bytes: {selectedFile.size}</p>
                            <p>
                                Last modified date:{' '}
                                {selectedFile.lastModifiedDate.toLocaleDateString()}
                            </p>
                        </div>
                    ) : (
                        <Form.Label>Select a file to show details</Form.Label>
                    )}
                    <Form.Control type="file" name="file" onChange={changeHandler} className="w-50 mx-auto" />
                    <div>
                        <Button onClick={handleSubmission} variant="outline-primary" className="m-3" >Submit</Button>
                    </div>
                </Form.Group>
            </div>

        </Fragment>

    )
}