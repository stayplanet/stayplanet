import { Component, Output, EventEmitter } from "@angular/core";
import { Modal, ModalController, ViewController, ToastController, NavParams } from "ionic-angular";

import moment from 'moment/src/moment';

import { DateItem } from "./date-picker.interface";

@Component({
  selector: 'date-picker',
  templateUrl: 'date-picker.html'
})
export class DatePicker {

  @Output()
  public onDateSelected: EventEmitter<Date> = new EventEmitter<Date>();

  @Output()
  public onCancelled: EventEmitter<any> = new EventEmitter<any>();

  inout: string;
  case: number = 0;
  checkInDay: any;
  checkOutDay: any;
  checkInDate: any = {};
  checkOutDate: any = {};
  currentMoment: moment.Moment;
  minLimit: moment.Moment;
  maxLimit: moment.Moment;
  daysGroupedByWeek = [];
  selectedDateItem: DateItem;
  daysOfMonth: DateItem[];
  calendarModal: Modal;

  constructor(
    public modalCtrl: ModalController,
    public viewCtrl: ViewController,
    private params: NavParams,
    private toastController: ToastController
  ) {

    let date = new Date();
    let today = moment(new Date(date.getFullYear(), date.getMonth(), date.getDate()));

    this.checkInDate = this.params.data.checkInDate;
    if (this.checkInDate) {
      this.checkInDay = moment(new Date(this.checkInDate.year, this.checkInDate.month, this.checkInDate.day));
    }
    this.checkOutDate = this.params.data.checkOutDate;
    if (this.checkOutDate) {
      this.checkOutDay = moment(new Date(this.checkOutDate.year, this.checkOutDate.month, this.checkOutDate.day));
    }

    this.inout = this.params.data.inout;

    if (this.inout == 'IN' && this.checkInDate && !this.checkOutDate) { //caso2
      this.case = 2;
      this.currentMoment = this.checkInDay.clone();
      this.minLimit = today.clone();
    } else if (this.inout == 'OUT' && !this.checkOutDate) { //caso3
      this.case = 3;
      this.currentMoment = this.checkInDay.clone().add(1, 'day');
      this.minLimit = this.checkInDay.clone().add(1, 'day');
    } else if (this.inout == 'OUT' && this.checkOutDate) { //caso4
      this.case = 4;
      this.currentMoment = this.checkOutDay.clone();
      this.minLimit = this.checkInDay.clone().add(1, 'day');
    } else if (this.inout == 'IN' && this.checkOutDate) { //caso5
      this.case = 5;
      this.currentMoment = this.checkInDay.clone();
      this.minLimit = today.clone();
    } else { //caso1
      this.case = 1;
      this.currentMoment = today.clone();
      this.minLimit = today.clone();
    }

    this.maxLimit = today.clone().add(2, "year");
    this.renderCalender();
  }

  renderCalender() {
    this.daysOfMonth = this.generateDaysOfMonth(this.currentMoment.year(), this.currentMoment.month() + 1, this.currentMoment.date());
    this.daysGroupedByWeek = this.groupByWeek(this.daysOfMonth);

    if (this.case == 5) {
      this.setSelectedDate(this.checkOutDay);
    } else if (this.case == 3 || this.case == 4) {
      this.setSelectedDate(this.checkInDay);
    }

    this.setSelectedDate(this.currentMoment);
  }

  generateDaysOfMonth(year: number, month: number, day: number) {
    let calendarMonth = moment(`${year}-${month}-${day}`, "YYYY-MM-DD");

    let startOfMonth = calendarMonth.clone().startOf("month").day("sunday");
    let endOfMonth = calendarMonth.clone().endOf("month").day("saturday");

    let totalDays = endOfMonth.diff(startOfMonth, "days") + 1;

    let calendarDays: DateItem[] = [];

    for (let i = 0; i < totalDays; i++) {
      let immunableStartOfMonth = startOfMonth.clone();
      let momentDate = immunableStartOfMonth.add(i, "day");
      let dateItem: DateItem = {
        isSelected: false,
        momentDate: momentDate,
        isEnabled: (this.isBelongToThisMonth(immunableStartOfMonth, month) && momentDate.isBetween(this.minLimit, this.maxLimit, null, '[]') ? true : false)
      };
      calendarDays.push(dateItem);
    }

    return calendarDays;
  }

  groupByWeek(daysOfMonth: DateItem[]) {
    let groupedDaysOfMonth = new Array<DateItem[]>();
    daysOfMonth.forEach((item, index) => {
      let groupIndex = Math.floor((index / 7));
      groupedDaysOfMonth[groupIndex] = groupedDaysOfMonth[groupIndex] || [];
      groupedDaysOfMonth[groupIndex].push(item);
    });
    return groupedDaysOfMonth;
  }

  selectDate(day: DateItem) {
    if (!day.isEnabled) {
      if (day.momentDate.isBefore(this.minLimit)) {
        let toast = this.toastController.create({
          message: 'Sorry, we don\'t provide time travels yet',
          duration: 2500,
          position: 'bottom'
        });
        toast.present();
      }
      if (day.momentDate.isAfter(this.maxLimit)) {
        let toast = this.toastController.create({
          message: 'That date is tooooo far away, isn\'t it?',
          duration: 2500,
          position: 'bottom'
        });
        toast.present();
      }
      return false;
    }

    if (this.selectedDateItem && this.selectedDateItem.isSelected) {
      this.selectedDateItem.isSelected = false;
    }

    if (this.case == 5 && day.momentDate.isSameOrAfter(this.checkOutDay)) {
        this.unSetSelectedDate(this.checkOutDay);
        this.checkOutDay = day.momentDate.clone().add(1, 'days');
        this.checkOutDate.year = this.checkOutDay.get('year');
        this.checkOutDate.month = this.checkOutDay.get('month');
        this.checkOutDate.day = this.checkOutDay.get('date');
        this.setSelectedDate(this.checkOutDay);
    }

    day.isSelected = true;
    this.selectedDateItem = day;
    this.currentMoment = day.momentDate.clone();
  }

  setSelectedDate(day) {
    let foundDates = this.daysOfMonth.filter((item: DateItem) => {
      if (day.isSame(item.momentDate)) {
        return item;
      }
    });
    if (foundDates && foundDates.length > 0) {
      this.selectedDateItem = foundDates[0];
      this.selectedDateItem.isSelected = true;
    }
  }

  unSetSelectedDate(day) {
    let foundDates = this.daysOfMonth.filter((item: DateItem) => {
      if (day.isSame(item.momentDate)) {
        return item;
      }
    });
    if (foundDates && foundDates.length > 0) {
      this.selectedDateItem = foundDates[0];
      this.selectedDateItem.isSelected = false;
    }
  }

  isBelongToThisMonth(momentDate: moment.Moment, month: number) {
    return momentDate.month() + 1 === month;
  }

  swipeEvent(event) {
    if (event.direction == 2) { //izquierda
      this.setMonthForward();
    } else if (event.direction == 4) { //derecha, backMonth
      this.setMonthBack();
    }
  }

  setMonthBack() {
    this.currentMoment.subtract(1, "month");
    if (this.currentMoment.isBefore(this.minLimit)) {
      this.selectDate( {"isEnabled": true, "isSelected": false, momentDate: this.minLimit} );
    }
    this.renderCalender();
  }

  setMonthForward() {
    this.currentMoment.add(1, "month");
    if (this.currentMoment.isAfter(this.maxLimit)) {
      this.selectDate( {"isEnabled": true, "isSelected": false, momentDate: this.maxLimit} );
    }
    this.renderCalender();
  }

  setYearBack() {
    this.currentMoment.subtract(1, "year");
    if (this.currentMoment.isBefore(this.minLimit)) {
      this.selectDate( {"isEnabled": true, "isSelected": false, momentDate: this.minLimit} );
    }
    this.renderCalender();
  }

  setYearForward() {
    this.currentMoment.add(1, "year");
    if (this.currentMoment.isAfter(this.maxLimit)) {
      this.selectDate( {"isEnabled": true, "isSelected": false, momentDate: this.maxLimit} );
    }
    this.renderCalender();
  }

  confirmDateSelection() {
    let data = {};
    let date = {
      day: this.selectedDateItem.momentDate.get('date'),
      month: this.selectedDateItem.momentDate.get('month'),
      year: this.selectedDateItem.momentDate.get('year'),
    }
    if (this.case == 3 || this.case == 4) {
      data = {
        "checkInDate": this.checkInDate,
        "checkOutDate": date
      }
    } else {
      data = {
        "checkInDate": date,
        "checkOutDate": this.checkOutDate
      }
    }
    this.viewCtrl.dismiss(data);
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  showCalendar(data: any) {
    this.calendarModal = this.modalCtrl.create(DatePicker, data);

    this.calendarModal.onDidDismiss((data: any) => {
      if (data) {
        this.onDateSelected.emit(data);
      } else {
        this.onCancelled.emit();
      }
    });

    this.calendarModal.present();
  }

}
