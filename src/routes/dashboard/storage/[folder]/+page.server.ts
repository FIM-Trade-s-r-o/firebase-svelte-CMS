// import { uploadString, uploadBytes, deleteObject, ref, listAll, getDownloadURL } from 'firebase/storage'
import { storage } from '$lib/firebase'

const pathToSlashPath = (path: string): string => {
    return path.replaceAll('|', '/')
}
const pathToPipePath = (path: string): string => {
    return path.replaceAll('/', '|')
}

const newFolder = async ({ request }) => {
    const data = await request.formData()
    const path = pathToSlashPath(data.get('path'))
    const folderName = data.get('folderName')
    if (folderName) {
        // const directory = ref(storage, path)
        // const newDirectory = ref(directory, folderName)
        // const ghostFile = ref(newDirectory, '.ghostfile')
        // await uploadString(ghostFile, '')
        await storage.file(`${path}/${folderName}/.ghostfile`).save('')
    }
}
const uploadFile = async (reference, file) => {
    // const uploadRef = ref(reference, file.name)
    // await uploadBytes(uploadRef, await file.arrayBuffer())
    await storage.file(`${reference}/${file}`)
}
const newFile = async ({ request }) => {
    const data = await request.formData()
    const path = pathToSlashPath(data.get('path'))
    const files = data.getAll('files[]')
    // const directory = ref(storage, path)
    if (files.length > 0) {
        let uploads = []
        for (const file of files) {
            uploads = [
                ...uploads,
                uploadFile(path, file)
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
    await storage.file(`${path}/.ghostfile`).delete()
    // const ghostFileRef = ref(storage, `${path}/.ghostfile`)
    // await deleteObject(ghostFileRef)
}
const deleteFile = async ({ request }) => {
    const data = await request.formData()
    const path = pathToSlashPath(data.get('path'))
    const name = data.get('name')
    await storage.file(`${path}/${name}`).delete()
    // const ghostFileRef = ref(storage, `${path}/${name}`)
    // await deleteObject(ghostFileRef)
}

export async function load ({ params }) {
    const path = pathToSlashPath(params.folder)
    // const reference = ref(storage, path.substring(1))

    // const response = await listAll(reference)
    const response = await storage.getFiles({ prefix: path.substring(1), delimiter: '/', autoPaginate: false })
    console.log(params.folder, path.substring(1))

    let folders = []
    let filePromises = []

    // response.prefixes.forEach((folderRef) => {
    //     folders = [
    //         ...folders,
    //         {
    //             name: folderRef.name,
    //             path: pathToPipePath(`/${folderRef.fullPath}`)
    //         }
    //     ]
    // })
    // response.items.forEach((itemRef) => {
    //     if (itemRef.name !== '.ghostfile') {
    //         filePromises = [
    //             ...filePromises,
    //             (async () => {
    //                 return {
    //                     name: itemRef.name,
    //                     url: await getDownloadURL(itemRef)
    //                 }
    //             })()
    //         ]
    //     }
    // })


    const prefixes = response[2].prefixes || []
    const files = response[0]

    // console.log(prefixes, '\n\n\n', files)

    prefixes.forEach((folderRef) => {
        console.log(folderRef)
        folders = [
            ...folders,
            {
                name: folderRef,
                path: pathToPipePath(`/${folderRef}`)
                // name: folderRef.name,
                // path: pathToPipePath(`/${folderRef.fullPath}`)
            }
        ]
    })
    files.forEach((itemRef) => {
        if (itemRef.name !== '.ghostfile') {
            filePromises = [
                ...filePromises,
                (async () => {
                    await itemRef.makePublic()
                    return {
                        name: itemRef.name,
                        url: itemRef.publicUrl()
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
    deleteFolder,
    deleteFile
}
