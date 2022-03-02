import { Toast } from "$lib/utils/alert";

// I18n doesn't work in this case
const handleAuthError = async (error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    let title, text;
    switch (errorCode) {
        case 'userIsNotAdmin': {
            title = 'Nedostatočné práva'
            text = 'Zadaný používateľ nie je administrátor'
            break;
        }
        case 'auth/user-not-found': {
            title = 'Používateľ nenájdený'
            text = 'Používateľ so zadanou emailovou adresou nie je registrovaný'
            break;
        }
        case 'auth/wrong-password': {
            title = 'Zlé heslo'
            text = ''
            break;
        }
        case "auth/email-already-in-use": {
            title = "Email už existuje";
            text = "Účet viazaný na tento email už existuje";
            break;
        }
        case "auth/invalid-email": {
            title = "Neplatný email";
            break;
        }
        case "auth/user-disabled": {
            title = "Účet suspendovaný";
            text = "V prípade nejasností nás kontaktuj"
            break;
        }
        default: {
            title = `Chyba ${errorCode}`;
            text = errorMessage;
        }
    }

    console.error(errorCode, errorMessage);
    await Toast.fire({
        icon: "error",
        title,
        text
    });
}

export {
    handleAuthError
}