import { firestore } from '$lib/firebase'
import config from '$lib/config'

const getCollectionData = async (collectionName) => {
    const sorting = config.getCollection(collectionName).sortBy
    let docsSnap
    if (sorting) {
        docsSnap = await firestore.collection(collectionName).orderBy(sorting.property, sorting.sort).get()
        // docsSnap = await getDocs(query(collection(firestore, collectionName), orderBy(sorting.property, sorting.sort)))
    } else {
        docsSnap = await firestore.collection(collectionName).get()
        // docsSnap = await getDocs(collection(firestore, collectionName))
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

const createDocument = async ({ request }) => {
    const data = await request.formData()
    const collectionName = data.get('collectionName')
    const schema = config.getCollection(collectionName).schema
    const retrievedFormData = {}
    schema.forEach(({ property, type }) => {
        retrievedFormData[property] = type.type(data.get(property))
    })
    const collectionRef = firestore.collection(collectionName)
    // const collectionRef = collection(firestore, collectionName)
    const docRef = await collectionRef.add(retrievedFormData)
    // const docRef = await addDoc(collectionRef, retrievedFormData)
    return {
        id: docRef.id
    }
}

const updateDocument = async ({ request }) => {
    const data = await request.formData()
    const collectionName = data.get('collectionName')
    const documentId = data.get('documentId')
    const schema = config.getCollection(collectionName).schema
    const retrievedFormData = {}
    schema.forEach(({ property, type }) => {
        retrievedFormData[property] = type.type(data.get(property))
    })
    await firestore.collection(collectionName).doc(documentId).update(retrievedFormData)
    // await updateDoc(doc(firestore, collectionName, documentId), retrievedFormData)
}

const deleteDocument = async ({ request }) => {
    const data = await request.formData()
    const collectionName = data.get('collectionName')
    const documentId = data.get('documentId')
    await firestore.collection(collectionName).doc(documentId).delete()
    // await deleteDoc(doc(firestore, collectionName, documentId))
}

export async function load ({ params }) {
    const collectionName = params.collection
    const collectionData = getCollectionData(collectionName)
    const schema = config.getCollection(collectionName).schema.toJSON()
    return {
        collectionName,
        collectionData,
        schema
    }
}

export const actions = {
    createDocument,
    updateDocument,
    deleteDocument
}
