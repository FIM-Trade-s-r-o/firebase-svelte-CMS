import { uploadString, uploadBytes, deleteObject, ref, listAll, getDownloadURL } from 'firebase/storage'
import { storage } from '$lib/firebase'

const pathToSlashPath = (path) => {
    return path.replaceAll('|', '/')
}
const pathToPipePath = (path) => {
    return path.replaceAll('/', '|')
}

const newFolder = async ({ request }) => {
    const data = await request.formData()
    const path = pathToSlashPath(data.get('path'))
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
    await uploadBytes(uploadRef, await file.arrayBuffer())
}
const newFile = async ({ request }) => {
    const data = await request.formData()
    const path = pathToSlashPath(data.get('path'))
    const files = data.getAll('files[]')
    const directory = ref(storage, path)
    if (files.length > 0) {
        let uploads = []
        for (const file of files) {
            uploads = [
                ...uploads,
                uploadFile(directory, file)
            ]
        }
        await Promise.all(uploads)
        return {
            filesCount: files.length
        }
    } else {
        return {
            filesCount: 0
        }
    }
}
const deleteFolder = async ({ request }) => {
    const data = await request.formData()
    const path = pathToSlashPath(data.get('path'))
    const ghostFileRef = ref(storage, `${path}/.ghostfile`)
    await deleteObject(ghostFileRef)
}

export async function load ({ params }) {
    const path = pathToSlashPath(params.folder)
    const reference = ref(storage, path.substring(1))

    const response = await listAll(reference)

    let folders = []
    let filePromises = []

    response.prefixes.forEach((folderRef) => {
        folders = [
            ...folders,
            {
                name: folderRef.name,
                path: pathToPipePath(`/${folderRef.fullPath}`)
            }
        ]
    })
    response.items.forEach((itemRef) => {
        if (itemRef.name !== '.ghostfile') {
            filePromises = [
                ...filePromises,
                (async () => {
                    return {
                        name: itemRef.name,
                        url: await getDownloadURL(itemRef)
                    }
                })()
            ]
        }
    })

    return {
        path: pathToPipePath(path),
        folders,
        files: await Promise.all(filePromises)
    }
}

export const actions = {
    newFolder,
    newFile,
    deleteFolder
}
