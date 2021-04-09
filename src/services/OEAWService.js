const OEAW_BASE_URL = 'https://mmp.acdh-dev.oeaw.ac.at/api/';

//stelle/?zitat=gentis

export async function getPassages(query = '', limit = 20) {
    console.log('getPassages()');
    const q = query.trim() == '' ? '' : query.trim();
    console.log(OEAW_BASE_URL + 'stelle/?limit=' + limit.toString() + '&offset=20' + '&zitat=' + q);
    const res = await fetch(OEAW_BASE_URL + 'stelle/?limit=' + limit.toString()+ '&offset=20' + '&zitat=' + q);
    if (!res.ok) {
        return []
    }

    let resjson = res.json();
    return resjson;
}

export async function getAuthor(request = '') {
    console.log('getAuthor()');
    console.log(request);
    const res = await fetch(request);
    if (!res.ok) {
        return []
    }
    return res.json();
}

export async function getPassageById(id = null) {
    console.log('getPassageByLegacyId()');
    if(id == null) return;
    console.log(OEAW_BASE_URL + 'stelle/'+id.toString())
    const res = await fetch(OEAW_BASE_URL + 'stelle/'+ id.toString());
    if (!res.ok) {
        return null;
    }
    return res.json();
}


