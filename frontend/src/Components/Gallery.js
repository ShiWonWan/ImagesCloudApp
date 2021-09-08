import { Fragment, useState, useEffect } from "react"
import { useHistory } from 'react-router'
import jwt_decode from 'jwt-decode'


import { UploadPhoto } from "./UploadPhoto"
import { PleaseLogIn } from "./PleaseLogIn"
import { Button } from 'react-bootstrap'

export const Gallery = () => {

    const [photos, setPhotos] = useState([])

    const history = useHistory()


    const getPhotos = async () => {
        var token = localStorage.getItem('token')
        var decoded = jwt_decode(token)
        const data = await fetch(`${process.env.REACT_APP_URL_API}/images/${decoded.id}`)
        const photos_res = await data.json()
        setPhotos(photos_res['images'])
    }

    const deletePhoto = async (id) => {
        await fetch(`${process.env.REACT_APP_URL_API}/user/delete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: id,
            })
        })
        getPhotos()
    }

    useEffect(() => {
        getPhotos()
    }, [])

    const Imagen = ({ data, alt }) => <img src={`data:image/png;base64,${data}`} alt={alt} className="p-3 m-3 img-fluid img-thumbnail w-25" />

    return (
        <Fragment>
            {localStorage.getItem('logged') === 'false' || localStorage.getItem('logged') === null ? <PleaseLogIn />
                : <Fragment>
                    <UploadPhoto getPhotos={getPhotos} />
                    <ul className="gallery text-center">
                        {photos.map(item => (
                            <li key={item.id}><Imagen data={item.body} alt="Image of user {user}" /><br /><Button variant="danger" onClick={() => deletePhoto(item.id)}>Delete</Button></li>
                        ))}
                    </ul>
                </Fragment>}
        </Fragment>
    )

}