// TypeORM Query Operators
import {Between} from "typeorm";
import {format} from 'date-fns';

export const BetweenDates = (from: Date | string, to: Date | string) =>
    Between(
        format(typeof from === 'string' ? new Date(from) : from, 'YYYY-MM-DD HH:MM:SS'),
        format(typeof to === 'string' ? new Date(to) : to, 'YYYY-MM-DD HH:MM:SS'),
    );