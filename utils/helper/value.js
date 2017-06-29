/*
*
*  ©2016-2017 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
*  Bangalore, India. All Rights Reserved.
*
*/

/*
Decision Model and Notation, v1.1
Page : 112 - 113
value and valueInverse functions for each of the time, date, date_and_time and duration types.
These functions are not exposed as a part of in-built function suite.
These are used for performing calculations and conversions.
*/

const moment = require('moment');
const { time, dateandtime, duration } = require('../built-in-functions');
const { defaultTz, date_ISO_8601, epoch } = require('./meta');

const prepareTime = (value) => {
  let remainingTime = value;
  const hour = Math.floor(remainingTime / 3600);
  remainingTime = value % 3600;
  const minute = Math.floor(remainingTime / 60);
  remainingTime = value % 60;
  const second = remainingTime;

  return moment({ hour, minute, second }).format(date_ISO_8601);
};

const valueT = obj => moment.duration(`PT${obj.hour}H${obj.minute}M${obj.second}S`).asSeconds();

const valueInverseT = (value) => {
  if (value >= 0 && value <= 86400) {
    return time(prepareTime(value));
  }
  const secondsFromMidnight = value - (Math.floor(value / 86400) * 86400);
  const timeStr = prepareTime(secondsFromMidnight);
  return time(`${timeStr}@${defaultTz}`);
};

const valueDT = (obj) => {
  const e = moment(epoch, date_ISO_8601);
  const duration = moment.duration(obj.diff(e));
  return duration.asSeconds();
};

const valueInverseDT = (value) => {
  const e = moment(epoch, date_ISO_8601);
  return dateandtime(e.add(value, 'seconds').format());
};

const valueDTD = obj => obj.asSeconds();

const valueInverseDTD = value => duration(`PT${Math.floor(value)}S`);

const valueYMD = obj => obj.asMonths();

const valueInverseYMD = value => duration(`P${Math.floor(value)}M`);

module.exports = { valueT, valueInverseT, valueDT, valueInverseDT, valueDTD, valueInverseDTD, valueYMD, valueInverseYMD };
