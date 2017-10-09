import { Component, Input, Output, EventEmitter, ViewEncapsulation } from "@angular/core";
import { Modal, ModalController, ViewController, NavParams } from "ionic-angular";

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

  private checkInDate: any;
  private checkOutDate: any;
  private currentMoment: moment.Moment;
  private today: moment.Moment = {};
  private limit: moment.Moment = {};
  private daysGroupedByWeek = [];
  private selectedDateItem: DateItem;
  private daysOfMonth: DateItem[];
  private calendarModal: Modal;

  constructor(public modalCtrl: ModalController, public viewCtrl: ViewController) {
    this.currentMoment = moment();
    
    let date = new Date();
    let today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    this.today["momentDate"] = moment(today);
    this.today["isEnabled"] = true;
    this.today["isSelected"] = false;

    this.limit["momentDate"] = moment(today).add(2, "year");
    this.limit["isEnabled"] = true;
    this.limit["isSelected"] = false;

    this.renderCalender();
  }

  private renderCalender() {
    this.daysOfMonth = this.generateDaysOfMonth(this.currentMoment.year(), this.currentMoment.month() + 1, this.currentMoment.date());
    this.daysGroupedByWeek = this.groupByWeek(this.daysOfMonth);
    let date = new Date(this.currentMoment.get('year'), this.currentMoment.get('month'), this.currentMoment.get('date'));
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
        isEnabled: (
          this.isBelongToThisMonth(
          immunableStartOfMonth, month) &&
          (momentDate.isAfter(this.today.momentDate) || momentDate.isSame(this.today.momentDate)) &&
          (momentDate.isBefore(this.limit.momentDate) || momentDate.isSame(this.limit.momentDate)) ?
          true : false) 
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
    if (!day.isEnabled) return;
    if (this.selectedDateItem && this.selectedDateItem.isSelected) {
      this.selectedDateItem.isSelected = false;
    }

    day.isSelected = true;
    this.selectedDateItem = day;
    this.currentMoment = day.momentDate.clone();

  }

  private setSelectedDate(day) {
    let today = moment().startOf("day");
    let foundDates = this.daysOfMonth
      .filter((item: DateItem) => day.isSame(item.momentDate.clone()));

    if (foundDates && foundDates.length > 0) {
      this.selectedDateItem = foundDates[0];
      this.selectedDateItem.isSelected = true;
    }
  }

  private isBelongToThisMonth(momentDate: moment.Moment, month: number) {
    return momentDate.month() + 1 === month;
  }

  private setMonthBack() {
    this.currentMoment.subtract(1, "month");
    if (moment(this.currentMoment).isBefore(this.today.momentDate)) {
      this.selectDate(this.today);
    }
    this.renderCalender();
  }

  private setMonthForward() {
    this.currentMoment.add(1, "month");
    if (this.currentMoment.isAfter(this.limit.momentDate)) {
      this.selectDate(this.limit);
    }
    this.renderCalender();
  }

  private setYearBack() {
    this.currentMoment.subtract(1, "year");
    if (this.currentMoment.isBefore(this.today.momentDate)) {
      this.selectDate(this.today);
    }
    this.renderCalender();
  }

  private setYearForward() {
    this.currentMoment.add(1, "year");
    if (this.currentMoment.isAfter(this.limit.momentDate)) {
      this.selectDate(this.limit);
    }
    this.renderCalender();
  }

  private confirmDateSelection() {
    let checkInDate = {
      day: this.selectedDateItem.momentDate.get('date'),
      month: this.selectedDateItem.momentDate.get('month'),
      year: this.selectedDateItem.momentDate.get('year'),

    }
    this.viewCtrl.dismiss(checkInDate);
  }

  private cancel() {
    this.viewCtrl.dismiss();
  }

  public showCalendar(checkInDate?: any) {
    this.checkInDate = checkInDate;
    this.calendarModal = this.modalCtrl.create(DatePicker);
    this.calendarModal.onDidDismiss((data: any) => {
      if (data) {
        this.onDateSelected.emit(data);
      }
      else {
        this.onCancelled.emit();
      }
    });

    this.calendarModal.present();
  }


}
