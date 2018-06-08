import moment from 'moment-timezone';
import _ from 'lodash';

export const displayStartTime = (startTime, tz) => {
    let st = moment(startTime);
    return st.tz(tz).format('YYYY-MM-DD HH:mm:ss UTCZ');
};
