export function canonicalize(name) {
    return name.replace(/\s/g, "").toLowerCase()
}

export function gameType(id) {
    switch (id) {
        case 2:
            return 'Normal 5v5 Blind Pick'
        case 4:
            return 'Ranked Solo 5v5'
        case 65:
            return 'ARAM'
        case 410:
            return 'Ranked 5v5 Draft Pick '
        default:
            return id
    }
}

export function rankedWinLoss(queueType, rankedLeagues, summonerId) {
    if (rankedLeagues[summonerId]) {
        return `${rankedLeagues[summonerId][0]['entries'][0]['wins']}W - ${rankedLeagues[summonerId][0]['entries'][0]['losses']}L`
    }
}