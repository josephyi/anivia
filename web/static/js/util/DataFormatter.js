export function canonicalize(name) {
    return name.replace(/\s/g, "").toLowerCase()
}

export function gameType(id) {
    switch (id) {
        case 4:
            return 'RANKED_SOLO_5x5'
        case 65:
            return 'ARAM'
        case 410:
            return 'Ranked 5v5 Draft Pick '
        default:
            return id
    }
}