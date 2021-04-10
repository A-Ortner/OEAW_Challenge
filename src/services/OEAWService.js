const OEAW_BASE_URL = 'https://mmp.acdh-dev.oeaw.ac.at/api/';

/**
 * Fetches text-passages that match the keyword(s) in the query
 * @param query: keyword(s) to be searched for
 * @param limit: number of datarows returned
 * @return a promise/list of matching datarows; including refences to the next/previous page (if paging is used)
 */
export async function getPassages(query = '', limit = 20) {
    console.log('getPassages()', query);
    const q = query.trim() == '' ? '' : query.trim();
    console.log(OEAW_BASE_URL + 'stelle/?limit=' + limit.toString() + '&offset=20' + '&zitat=' + q);
    const res = await fetch(OEAW_BASE_URL + 'stelle/?limit=' + limit.toString() + '&offset=20' + '&zitat=' + q);
    if (!res.ok) {
        return []
    }

    return res.json();

}

/**
 * Fetches a specific page for pagination via API call
 * @param request: API call to be made
 * @return a promise/list of datarows; including refences to the next/previous page (if paging is used)
 */
export async function getPage(request) {
    console.log("getPage()", request);
    const res = await fetch(request);
    if (!res.ok) {
        return []
    }
    return res.json();

}

/**
 * Fetches a specific author via API call
 * @param request API call including the author´s id
 * @return promise/specified author
 */
export async function getAuthor(request = '') {
    const res = await fetch(request);
    if (!res.ok) {
        return []
    }
    return res.json();
}

/**
 * Fetches specific passage from DB
 * @param id: id of the passage to be fetched
 * @return promise/specified passage
 */
export async function getPassageById(id = null) {
    console.log('getPassageByLegacyId()', id);
    if (id == null) return;
    console.log(OEAW_BASE_URL + 'stelle/' + id.toString())
    const res = await fetch(OEAW_BASE_URL + 'stelle/' + id.toString());
    if (!res.ok) {
        return null;
    }
    return res.json();
}


