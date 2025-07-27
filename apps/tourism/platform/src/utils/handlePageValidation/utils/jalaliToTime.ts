import moment from 'moment-jalaali';

const jalaliToTime = (input: string) => {
  const inputDate = moment(input, 'jYYYY-jMM-jDD').toDate();
  inputDate.setHours(0, 0, 0, 0);

  return inputDate.getTime();
};

export default jalaliToTime;
