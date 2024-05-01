const platform = 0
const for_menus = true
const with_address = false
const with_buildings = true

async function getMenu(school, date) {
    let data = {}
    const info_response = await fetch(`https://api.dineoncampus.com/v1/sites/${school}/info`).then(res => res.json())
    const site_id = info_response.site.id
    const all_locations_response = await fetch(`https://api.dineoncampus.com/v1/locations/all_locations?platform=${platform}&site_id=${site_id}&for_menus=${for_menus}&with_address=${with_address}&with_buildings=${with_buildings}`).then(res => res.json())
    const locations = all_locations_response.locations
    await Promise.all(locations.map(async location => {
        const locationSlug = location.name.toLowerCase().replace(/ /g, '-')
        data[locationSlug] = {}

        const allPeriodsResponse = await fetch(`https://api.dineoncampus.com/v1/location/${location.id}/periods?platform=${platform}&date=${date}`).then(res => res.json())
        const periods = allPeriodsResponse.periods
        if (!periods) return

        await Promise.all(periods.map(async period => {
            data[locationSlug][period.name] = {}
            const categoriesResponse = await fetch(`https://api.dineoncampus.com/v1/location/${location.id}/periods/${period.id}?platform=0&date=${date}`).then(res => res.json())
            const categories = categoriesResponse.menu.periods.categories

            categories.forEach(category => {
                data[locationSlug][period.name][category.name] = category.items.map(item => item.name)
            })
        }))
    }))
    return data
}
let cache = {}
async function getMenuCached(school, date) {
    if (cache[school] && cache[school][date]) {
        return cache[school][date]
    } else {
        let data = await getMenu(school, date)
        if (!cache[school]) {
            cache[school] = {}
        }
        cache[school][date] = data
        return data
    }
}

async function getDiff(school, beforeDate, nowDate) {
    let diff = {}
    let same = {}
    const [now, before] = await Promise.all([
        getMenuCached(school, nowDate),
        getMenuCached(school, beforeDate)
    ]);
    for (const location in now) {
        diff[location] = {}
        same[location] = {}
        for (const period in now[location]) {
            for (const category in now[location][period]) {
                const nowItems = now[location][period][category]
                const beforeItems = before[location][period][category]

                if (!diff[location][period]) diff[location][period] = {}
                if (!same[location][period]) same[location][period] = {}

                diff[location][period][category] = nowItems.filter(item => !beforeItems.includes(item))
                same[location][period][category] = nowItems.filter(item => beforeItems.includes(item))
            }
        }
    }

    return {diff, same}
}

export {
    getMenuCached,
    getDiff
}