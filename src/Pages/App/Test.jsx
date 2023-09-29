import React, { useState } from 'react';
import { createClient } from 'pexels';





export default function Test() {

    const [photos, setPhotos] = useState([])
    const [searchLorem, setSearchLorem] = useState()

    function search(ev) {
        const client = createClient('4E2I64xvTKXk7hKaoMocmUalLrPn30zzMCHsymyHKMoPcbFxDVqDmg59');
        client.photos.search({ query: searchLorem, per_page: 100 }).then(photos => {
            setPhotos(photos.photos)
        });
    }



    return (
        <div>

            <div>
                <input type="text" onChange={(ev) => { setSearchLorem(ev.target.value) }} />
                <button onClick={search}>Buscar</button>
            </div>


            {photos.map((element, key) => (<>
                <img width={360} src={element?.src?.medium} />
            </>))}
        </div >
    )
}