import moment from 'moment';

export const formatISO = (date: string, format: string) => {
    return moment(date).format(format);
}