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

  private inout: string;
  private case: number = 0;
  private checkInDay: any;
  private checkOutDay: any;
  private checkInDate: any = {};
  private checkOutDate: any = {};
  private currentMoment: moment.Moment;
  private minLimit: moment.Moment = {};
  private maxLimit: moment.Moment = {};
  private daysGroupedByWeek = [];
  private selectedDateItem: DateItem;
  private daysOfMonth: DateItem[];
  private calendarModal: Modal;

  constructor(
    public modalCtrl: ModalController,
    public viewCtrl: ViewController,
    private params: NavParams,
    private toastController: ToastController
  ) {

    let date = new Date();
    let today = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    this.checkInDate = this.params.data.checkInDate;
    if (this.checkInDate) {
      this.checkInDay = new Date(this.checkInDate.year, this.checkInDate.month, this.checkInDate.day);
    }
    this.checkOutDate = this.params.data.checkOutDate;
    if (this.checkOutDate) {
      this.checkOutDay = new Date(this.checkOutDate.year, this.checkOutDate.month, this.checkOutDate.day);
    }

    this.inout = this.params.data.inout;

    if (this.inout == 'IN' && this.checkInDate && !this.checkOutDate) { //caso2
      this.case = 2;
      this.currentMoment = moment(this.checkInDay);
      this.minLimit["momentDate"] = moment(today);
    } else if (this.inout == 'OUT' && !this.checkOutDate) { //caso3
      this.case = 3;
      this.currentMoment = moment(this.checkInDay).add(1, 'day');
      this.minLimit["momentDate"] = moment(this.checkInDay).add(1, 'day');
    } else if (this.inout == 'OUT' && this.checkOutDate) { //caso4
      this.case = 4;
      this.currentMoment = moment(this.checkOutDay);
      this.minLimit["momentDate"] = moment(this.checkInDay).add(1, 'day');
    } else if (this.inout == 'IN' && this.checkOutDate) { //caso5
      this.case = 5;
      this.currentMoment = moment(this.checkInDay);
      this.minLimit["momentDate"] = moment(today);
      this.maxLimit["momentDate"] = moment(this.checkOutDay).subtract(1, 'day');
      this.maxLimit["isEnabled"] = true;
      this.maxLimit["isSelected"] = false;
    } else { //caso1
      this.case = 1;
      this.currentMoment = moment(today);
      this.minLimit["momentDate"] = moment(today);
    }

    this.minLimit["isEnabled"] = true;
    this.minLimit["isSelected"] = false;

    if (this.case != 5) {
      this.maxLimit["momentDate"] = moment(today).add(2, "year");
      this.maxLimit["isEnabled"] = true;
      this.maxLimit["isSelected"] = false;
    }

    this.renderCalender();
  }

  private renderCalender() {
    this.daysOfMonth = this.generateDaysOfMonth(this.currentMoment.year(), this.currentMoment.month() + 1, this.currentMoment.date());
    this.daysGroupedByWeek = this.groupByWeek(this.daysOfMonth);
    let date = new Date(this.currentMoment.get('year'), this.currentMoment.get('month'), this.currentMoment.get('date'));

    if (this.case == 5) {
      this.setSelectedDate(moment(this.checkOutDay));
    } else if (this.case == 3 || this.case == 4) {
      this.setSelectedDate(moment(this.checkInDay));
    }
    this.setSelectedDate(moment(date));
  }

  private generateDaysOfMonth(year: number, month: number, day: number) {
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
        isEnabled: (this.isBelongToThisMonth(immunableStartOfMonth, month) && momentDate.isBetween(this.minLimit.momentDate, this.maxLimit.momentDate, null, '[]') ? true : false)
      };
      calendarDays.push(dateItem);
    }

    return calendarDays;
  }

  private groupByWeek(daysOfMonth: DateItem[]) {
    let groupedDaysOfMonth = new Array<DateItem[]>();
    daysOfMonth.forEach((item, index) => {
      let groupIndex = Math.floor((index / 7));
      groupedDaysOfMonth[groupIndex] = groupedDaysOfMonth[groupIndex] || [];
      groupedDaysOfMonth[groupIndex].push(item);
    });
    return groupedDaysOfMonth;
  }

  private selectDate(day: DateItem) {
    if (!day.isEnabled) {
      if (day.momentDate.isBefore(this.minLimit.momentDate)) {
        let toast = this.toastController.create({
          message: 'Sorry, we don\'t provide time travels yet',
          duration: 2500,
          position: 'bottom'
        });
        toast.present();
      }
      if (day.momentDate.isAfter(this.maxLimit.momentDate)) {
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

    day.isSelected = true;
    this.selectedDateItem = day;
    this.currentMoment = day.momentDate.clone();
  }

  private setSelectedDate(day) {
    let foundDates = this.daysOfMonth.filter((item: DateItem) => {
      if (day.get("date") == item.momentDate.get("date") && day.get("month") == item.momentDate.get("month") && day.get("year") == item.momentDate.get("year")) {
        return item;
      }
    });
    if (foundDates && foundDates.length > 0) {
      this.selectedDateItem = foundDates[0];
      this.selectedDateItem.isSelected = true;
    }
  }

  private isBelongToThisMonth(momentDate: moment.Moment, month: number) {
    return momentDate.month() + 1 === month;
  }

  swipeEvent(event) {
    if (event.direction == 2) { //izquierda
      this.setMonthForward();
    } else if (event.direction == 4) { //derecha, backMonth
      this.setMonthBack();
    }
  }

  private setMonthBack() {
    this.currentMoment.subtract(1, "month");
    if (moment(this.currentMoment).isBefore(this.minLimit.momentDate)) {
      this.selectDate(this.minLimit);
    }
    this.renderCalender();
  }

  private setMonthForward() {
    this.currentMoment.add(1, "month");
    if (this.currentMoment.isAfter(this.maxLimit.momentDate)) {
      this.selectDate(this.maxLimit);
    }
    this.renderCalender();
  }

  private setYearBack() {
    this.currentMoment.subtract(1, "year");
    if (this.currentMoment.isBefore(this.minLimit.momentDate)) {
      this.selectDate(this.minLimit);
    }
    this.renderCalender();
  }

  private setYearForward() {
    this.currentMoment.add(1, "year");
    if (this.currentMoment.isAfter(this.maxLimit.momentDate)) {
      this.selectDate(this.maxLimit);
    }
    this.renderCalender();
  }

  private confirmDateSelection() {
    let date = {
      day: this.selectedDateItem.momentDate.get('date'),
      month: this.selectedDateItem.momentDate.get('month'),
      year: this.selectedDateItem.momentDate.get('year'),
    }
    this.viewCtrl.dismiss(date);
  }

  private cancel() {
    this.viewCtrl.dismiss();
  }

  public showCalendar(data: any) {
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
