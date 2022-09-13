import { firestore } from '$lib/firebase'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import config from '$lib/config'

const getCollectionData = async (collectionName) => {
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
    const collectionData = await getCollectionData(collectionName)
    const schema = config.getCollection(collectionName).schema.toJSON()
    return {
        collectionData,
        collectionName,
        schema
    }
}
