let language = 'es';
const { validate, clean, format } = require('rut.js');
const moment = require('moment');

let dict = {
    'es': {
        required: 'Debe ingresar este campo.',
        acceptTermsAndConditions: 'Debe aceptar los términos y condiciones.',
        requiredBooleanValue: 'Debe ingresar este campo.',
        requiredPositive: 'El valor ingresado debe ser positivo.',
        email: "Debe ingresar un email válido.",
        phone: "Debe ingresar un número de teléfono válido.",
        phoneRequired: "Debe ingresar un número de teléfono válido.",
        rut: "El rut ingresado no es válido.",
        betweenValues: (v1, v2) => ('El valor ingresado debe estar entre ' + v1  + ' y ' + v2),
        confirmation: (v1, v2) => ('Las contraseñas deben ser iguales'),
        atLeastOneSelected: 'Debe seleccionar al menos un item.',
        greaterThanAndPositive: (v1) => ('El valor debe ser mayor que ' + v1),
        greaterOrEqualThan: (v1) => ('El valor debe ser igual o mayor que ' + v1),
        minimumNCharacters: (v1) => ('Debe contener a lo menos ' + v1 + ' caracteres.'),
        timeAfter: (v1) => ('Hora fin del turno debe ser pasadas las ' + v1),
        valueGreaterFunction: (v1) => ('El valor debe ser mayor o igual que ' + v1),
        mustContain: (pattern) =>  ('Debe contener la palabra "' + pattern + '"'),
        atMost5MB: 'El archivo cargado debe pesar a lo más 5 MB.',
        maximum4KG: 'El paquete no puede pesar más de 4 Kg.',
        nearestSubway: 'La dirección debe estar a 500 metros o menos de una estación de metro.',
        maximumCM: 'El valor debe ser menor o igual a 100 cm.',
        minimum2Words: 'Debe ingresar por lo menos el nombre y apellido.'
    },
    'en': {
        required: 'You must enter this field.',
        acceptTermsAndConditions: 'Must accept terms and conditions.',
        requiredBooleanValue: 'You must enter this field.',
        requiredPositive: 'The value must be positive.',
        email: "You must enter a valid email.",
        phone: "You must enter a valid phone number.",
        phoneRequired: "You must enter a valid phone number.",
        rut: "The identifier is not valid.",
        betweenValues: (v1, v2) => ('The value must be between ' + v1  + ' and ' + v2),
        confirmation: (v1, v2) => ('Passwords must be the same'),
        atLeastOneSelected: 'Must select at least one item.',
        greaterThanAndPositive: (v1) => ('The value must be greater than ' + v1),
        greaterOrEqualThan: (v1) => ('The value must be greater or equal than ' + v1),
        minimumNCharacters: (v1) =>  ('Must contains at least ' + v1 + ' characters.'),
        timeAfter: (v1) =>  ('End hour must be greater past ' + v1),
        valueGreaterFunction: (v1) => ('The value must be greater than or equal to ' + v1),
        mustContain: (pattern) =>  ('Must contain the word "' + pattern + '"'),
        atMost5MB: 'The file uploaded must be at most 5 MB.',
        maximum4KG: 'The package cannot weigh more than 4 Kg.',
        nearestSubway: 'The address must be 500 meters or less from a subway station.',
        maximumCM: 'The value must be less or equal than 100cm.',
        minimum2Words: 'Must input at least first name and last name.'
    },
    'de': {
        required: 'Sie müssen dieses Feld eingeben.',
        acceptTermsAndConditions: 'Muss Geschäftsbedingungen akzeptieren.',
        requiredBooleanValue: 'Sie müssen dieses Feld eingeben.',
        requiredPositive: 'Der Wert muss positiv sein.',
        email: "Sie müssen eine gültige E-Mail-Adresse eingeben.",
        phone: "Sie müssen eine gültige Telefonnummer eingeben.",
        phoneRequired: "Sie müssen eine gültige Telefonnummer eingeben.",
        rut: "Die Kennung ist ungültig.",
        betweenValues: (v1, v2) => ('Der Wert muss zwischen liegen ' + v1  + ' und ' + v2),
        confirmation: (v1, v2) => ('Passwörter müssen gleich sein'),
        atLeastOneSelected: 'Muss mindestens einen Artikel auswählen.',
        greaterThanAndPositive: (v1) => ('Der Wert muss größer sein als ' + v1),
        greaterOrEqualThan: (v1) => ('Der Wert muss größer oder gleich sein als ' + v1),
        minimumNCharacters: (v1) =>  ('Muss mindestens enthalten ' + v1 + ' zeichen.'),
        timeAfter: (v1) =>  ('Die Endstunde muss länger dauern ' + v1),
        valueGreaterFunction: (v1) => ('Der Wert muss größer oder gleich sein ' + v1),
        mustContain: (pattern) =>  ('Muss das Wort enthalten "' + pattern + '"'),
        atMost5MB: 'Die hochgeladene Datei darf höchstens 5 MB groß sein.',
        maximum4KG: 'Die Packung darf nicht mehr als 4 kg wiegen.',
        nearestSubway: 'Die Adresse darf höchstens 500 Meter von einer U-Bahnstation entfernt sein.',
        maximumCM: 'Der Wert muss kleiner oder gleich 100 cm sein.',
        minimum2Words: 'Muss mindestens Vor- und Nachname eingeben.'
    }
};


export default {
    changeLanguage(l) {
        switch (l) {
            case 'es': case 'es-MX': case 'es-ES':
                language = 'es';
                break;
            case 'en': case 'en-US': case 'en-UK':
                language = 'en';
                break;
            default:
                language = 'es';
        }
    },

    required: text => value => (value !== null && value !== "") || text || dict[language].required,
    acceptTermsAndConditions: text => value => !!value && value === true || text || dict[language].acceptTermsAndConditions,
    phoneRequired: text => value => !!value && value === true || text || dict[language].phoneRequired,
    requiredBooleanValue: text => value => value != null || text || dict[language].requiredBooleanValue,
    requiredPositive: text => value => (value != null && value > 0) || text || dict[language].requiredPositive,
    greaterThanAndPositive: (greaterThanValue, text) => value => (value != null && value > greaterThanValue && value > 0) || text || dict[language].greaterThanAndPositive(greaterThanValue),
    greaterOrEqualThan: (greaterThanValue, text) => value => (value != null && value >= greaterThanValue) || text || dict[language].greaterOrEqualThan(greaterThanValue),
    mustContain: (pattern, text) => value => (value != null && value.split(' ').join('').toLowerCase().includes(pattern)) || text || dict[language].mustContain(pattern),
    email: text => value => {
        if(!value) return true;
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return !!value && pattern.test(value.trim()) || text || dict[language].email;
    },
    phoneNumber: text => value => {
        const pattern = /^[+]*[\s/0-9]{8,}$/;
        return pattern.test(value) || text || dict[language].phone;
    },
    validRut: text => value => value != null && validate(value)|| text || dict[language].rut,
    atLeastOneSelected: text => value => value.length > 0 || text || dict[language].atLeastOneSelected,
    betweenValues: (value1, value2) => text => value => (value <= value2 && value >= value1)
      || text || dict[language].betweenValues(value1, value2),
    requiredWhenOtherIsSelected: array => valueIncluded => text => value => !array.includes(valueIncluded)
      || (array.includes(valueIncluded) && !!value) || text || 'Debe ingresar este campo.',
    requiredWhenEqualThan(equalValue, valueToCompare, text) {
        return value => equalValue !== valueToCompare || (equalValue === valueToCompare && value != null) || text || 'Debe ingresar este campo.';
    },
    dateAfterToday(text) {
        return value => {
            let date = new Date();
            if (value) {
                let dates = value.split("/");
                date = new Date(dates[2], dates[1] - 1, dates[0]);
            }

            return date >= new Date() || text || 'La fecha debe ser posterior a la actual.'
        }
    },
    dateBeforeOrToday(text) {
        return value => {
            let date = new Date();
            if (value) {
                let dates = value.split("/");
                date = new Date(dates[2], dates[1] - 1, dates[0]);
            }

            return date <= new Date() || text || 'La fecha no debe ser posterior a la actual.'
        }
    },
    confirmation(equalValue, text) {
        return value => equalValue === value || text || 'Los campos no coinciden.';
    },
    minimumNCharacters(n, text) {
        return value =>  value.length > 0 && n <= value.length || text || dict[language].minimumNCharacters(n);
    },
    atMost5MB(text) {
        return value => value == null || value && value.size <= 5*1024*1024 || text || dict[language].atMost5MB;
    },
    maximum4KG(text) {
        return value =>  value && value <= 4 || text || dict[language].maximum4KG;
    },
    valueGreaterFunction(value, text) {
        return v => v == null || v === '' || parseFloat(value()) <= parseFloat(v) || text || dict[language].valueGreaterFunction(value());
    },
    timeAfter(time, text) {
        return value => value && time < value || text || dict[language].timeAfter(time);
    },
    timeAfterFunction(time, text) {
        return value => value && time() < value || text || dict[language].timeAfter(time());
    },
    mustBeNMinutesAfter(N, time, text) {
        return value => value && moment(time(), "hh:mm").add(N, 'minutes').format('HH:mm') <= value || text || dict[language].mustBeNMinutesAfter(time());
    },
    minimum2Words(text) {
        return value =>  value && value.split(" ").map(s => s.trim()).filter(s => s.length > 0).length > 1 || text || dict[language].minimum2Words;
    },
    nearestSubway(error, text) {
        return value => !error || text || dict[language].nearestSubway;
    },
    maximumCM(text) {
        return value => value <= 100 || text || dict[language].maximumCM;
    }
};
