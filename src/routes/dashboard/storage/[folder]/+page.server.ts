import {uploadString, uploadBytes, deleteObject, ref, listAll, getDownloadURL} from 'firebase/storage'
import { storage } from '$lib/firebase'

const newFolder = async ({ request }) => {
    const data = await request.formData()
    const path = data.get('path')
    const folderName = data.get('folderName')
    if (folderName) {
        const directory = ref(storage, path)
        const newDirectory = ref(directory, folderName)
        const ghostFile = ref(newDirectory, '.ghostfile')
        await uploadString(ghostFile, '')
    }
}
const uploadFile = async (reference, file) => {
    const uploadRef = ref(reference, file.name)
    await uploadBytes(uploadRef, file)
}
const newFile = async ({ request }) => {
    const data = await request.formData()
    const path = data.get('path')
    const files = data.get('files')
    const directory = ref(storage, path)
    if (files.length > 0) {
        console.log(files)
        let uploads = []
        for (const file of files) {
            uploads = [
                ...uploads,
                uploadFile(directory, file)
            ]
        }
        await Promise.all(uploads)
        return {
            filesLength: files.length
        }
    } else {
        return {
            filesLength: 0
        }
    }
}
const deleteFolder = async ({ request }) => {
    const data = await request.formData()
    const path = data.get('path')
    const ghostFileRef = ref(storage, `${path}/.ghostfile`)
    await deleteObject(ghostFileRef)
}

export async function load ({ params }) {
    const queryPath = (params.folder).replaceAll('|', '/')
    const path = queryPath === 'root' ? '/' : queryPath
    const reference = ref(storage, queryPath)

    const response = await listAll(reference)

    let folders = []
    let filePromises = []

    response.prefixes.forEach((folderRef) => {
        folders = [
            ...folders,
            {
                name: folderRef.name,
                path: folderRef.fullPath.replaceAll('/', '|')
            }
        ]
    })
    response.items.forEach((itemRef) => {
        if (itemRef.name !== '.ghostfile') {
            filePromises = [
                ...filePromises,
                async () => {
                    return {
                        name: itemRef.name,
                        url: await getDownloadURL(itemRef)
                    }
                }
            ]
        }
    })


    return {
        path,
        folders,
        files: await Promise.all(filePromises)
    }
}

export const actions = {
    newFolder,
    newFile,
    deleteFolder
}
