import React, { useState, useEffect } from 'react'
import { Feature } from '../components'

export default function Play() {
    const [loading, setLoading] = useState(false) 
    const [featured, setFeatured] = useState([])
    const [overview, setOverview] = useState()

    useEffect(() => {
        const fetchFeatured = async () => {
            setLoading(true)
            console.log('Fetching featured')
            const resp = await fetch('/api/featured')
            const { featured } = await resp.json()
            setFeatured(featured)
            setLoading(false)
        }
        fetchFeatured()
    }, [])

    const submitResult = async (id, result) => {
        console.log('Updating results')
        const resp = await fetch('/api/result', {
            method: 'PATCH',
            body: JSON.stringify({ id, result })
        })
        const overview = await resp.json()
        setOverview(overview)
    }

    const showFeatured = () => {
        return !featured[0] ? <p className="centered">We're out of submissions!</p>
        : featured.map(f => <Feature key={f.ts} sub={f} submit={submitResult}/>)
    }

    const showTotals = () => overview ? <p id="total">{overview.totalCorrect} / {overview.totalShown} correct</p> : null

    return (
        <div id="play">
           { loading ?
            <p>Loading . . .</p>
           :
            <><div id="featured" className={featured.length > 1 ? 'multi' : 'one'}>
                {showFeatured()}
            </div>
            {showTotals()}</>
           }
        </div>
    )
}
