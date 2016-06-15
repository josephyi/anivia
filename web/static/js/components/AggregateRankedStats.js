import React from 'react'

const AggregateRankedStats = ({aggregateRankedStats}) => {
    if (aggregateRankedStats) {
        return (
            <div>
                <h2>
                    Ranked: {aggregateRankedStats.totalSessionsWon || '0'}W-{aggregateRankedStats.totalSessionsLost || '0'}L</h2>
                <h2>Ranked
                    KDA: {(aggregateRankedStats.totalChampionKills / aggregateRankedStats.totalSessionsPlayed).toFixed(2)}
                    /{(aggregateRankedStats.totalDeathsPerSession / aggregateRankedStats.totalSessionsPlayed).toFixed(2)}
                    /{(aggregateRankedStats.totalAssists / aggregateRankedStats.totalSessionsPlayed).toFixed(2)},
                    {' '}{((aggregateRankedStats.totalChampionKills + aggregateRankedStats.totalAssists) / aggregateRankedStats.totalDeathsPerSession).toFixed(2)}:1
                </h2>
            </div>)
    } else {
        return (<div>loading</div>)
    }
}

export default AggregateRankedStats