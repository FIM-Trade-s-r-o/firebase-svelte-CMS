# firebase-svelte-CMS

This is minimal Firebase headless CMS, it is not ready for use in production.
Because of lacking i18n support for svelteKit, this CMS is only in Slovak language.

## Usage

This project is meant to be used as submodule of some repo. CMS is pointless to be standalone, and it doesn't give sense
to deployed as it is (also it can't be used as it is). You can tailor this CMS to be used for specific purposes by 
altering configuration files.

### List of configuration files

- `/src/lib/config/index.ts` points to `/../CMS-config/general.ts`
- `/src/lib/firebase/config.json` points to `/../CMS-config/firebase/config.json`
- `/src/firebase.json` points to `/../CMS-config/firebase/firebase.json`
- `/src/.firebaserc` points to `/../CMS-config/firebase/.firebaserc`
- `/src/lib/schemas/schemas.ts` points to `/../CMS-config/schemas.ts`

## Deploy

Deploy expects one directory above this project root, folder called `functions` containing firebase cloud functions.
