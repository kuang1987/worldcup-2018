import moment from 'moment-timezone';
import _ from 'lodash';

let june = moment();
// console.log(june.isBefore(moment("2018-06-17T21:00:00+03:00")));
let offset = june.tz('America/Mexico_City').format('Z');
let text = '(UTC-07:00) Chihuahua';
let rep = text.replace(/[+-]\d\d:\d\d/g, offset);
console.log(rep);

// console.log(moment.tz._zones);
