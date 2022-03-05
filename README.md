# firebase-svelte-CMS

This is minimal Firebase headless CMS, it is not ready for use in production.
Because of lacking i18n support for svelteKit, this CMS is only in Slovak language.

## Usage

This project is meant to be used as submodule of some repo. CMS is pointless to be standalone, and it doesn't give sense
to deployed as it is (also it can't be used as it is). You can tailor this CMS to be used for specific purposes by 
altering configuration files.

### List of configuration files

- `/src/lib/config/index` will point to `/../CMS-config/general`
- `/src/lib/firebase/config.json` will point to `/../CMS-config/firebase.json`
- `/src/lib/schemas/schemas.ts` will point to `/../CMS-config/schemas.ts`

## Deploy

Deploy expects one directory above this project root, folder called `functions` containing firebase cloud functions.
