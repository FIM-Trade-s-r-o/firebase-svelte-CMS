import { firestore } from '$lib/firebase'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import config from '$lib/config'

const getCollection = async (collectionName) => {
    const sorting = config.getCollection(collectionName).sortBy
    let docsSnap
    if (sorting) {
        docsSnap = await getDocs(query(collection(firestore, collectionName), orderBy(sorting.property, sorting.sort)))
    } else {
        docsSnap = await getDocs(collection(firestore, collectionName))
    }

    let collectionData = []
    await docsSnap.forEach(document => {
        // console.log(document)
        collectionData = [
            ...collectionData,
            {
                id: document.id,
                ...document.data()
            }
        ]
    })
    return collectionData
}
export async function load ({ params }) {
    const collectionName = params.collection
    const collectionData = await getCollection(collectionName)
    return {
        collectionData,
        collectionName
    }
}
