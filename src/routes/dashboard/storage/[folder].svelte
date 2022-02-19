<script lang="ts" context="module">
    import { ref, listAll } from "firebase/storage";
    import { storage } from "$lib/firebase";

    export async function load({ page }) {
        const path = page.params.folder;
        console.log(path)

        const listRef = ref(storage, path === 'root' ? '/' : path);

        const response = await listAll(listRef);

        let folders = [];
        let files = [];

        response.prefixes.forEach((folderRef) => {
            folders = [
                ...folders,
                folderRef
            ]
        });
        response.items.forEach((itemRef) => {
            files = [
                ...files,
                itemRef
            ]
        });

        return {
            props: {
                folders,
                files
            }
        };
    }
</script>
<script lang="ts">
    export let folders;
    export let files;

    $: console.log(folders);
    $: console.log(files);
</script>
