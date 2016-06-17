import React from 'react'

const AggregateRankedStats = ({aggregateRankedStats}) => {
    if (aggregateRankedStats) {
        return (
            <div>
                <div>
                    Ranked: {aggregateRankedStats.totalSessionsWon || '0'}W-{aggregateRankedStats.totalSessionsLost || '0'}L</div>
                <div>Ranked
                    KDA: {(aggregateRankedStats.totalChampionKills / aggregateRankedStats.totalSessionsPlayed).toFixed(2)}
                    /{(aggregateRankedStats.totalDeathsPerSession / aggregateRankedStats.totalSessionsPlayed).toFixed(2)}
                    /{(aggregateRankedStats.totalAssists / aggregateRankedStats.totalSessionsPlayed).toFixed(2)},
                    {' '}{((aggregateRankedStats.totalChampionKills + aggregateRankedStats.totalAssists) / aggregateRankedStats.totalDeathsPerSession).toFixed(2)}:1
                </div>
            </div>)
    } else {
        return (<div>loading</div>)
    }
}

export default AggregateRankedStats