import { Component, Output, EventEmitter, ViewEncapsulation } from "@angular/core";
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

  private currentMoment: moment.Moment;
  private daysGroupedByWeek = [];
  private selectedDateItem: DateItem;
  private daysOfMonth: DateItem[];
  private calendarModal: Modal;

  constructor(public modalCtrl: ModalController, public viewCtrl: ViewController) {
    this.currentMoment = moment();
    this.renderCalender();
  }

  private renderCalender() {
    this.daysOfMonth = this.generateDaysOfMonth(this.currentMoment.year(), this.currentMoment.month() + 1, this.currentMoment.date());
    this.daysGroupedByWeek = this.groupByWeek(this.daysOfMonth);

    this.setTodayAsDefaultSelectedDate();
  }

  private generateDaysOfMonth(year: number, month: number, day: number) {
    let calendarMonth = moment(`${year}-${month}-${day}`, "YYYY-MM-DD");

    let startOfMonth = calendarMonth.clone().startOf("month").day("sunday");
    let endOfMonth = calendarMonth.clone().endOf("month").day("saturday");

    let totalDays = endOfMonth.diff(startOfMonth, "days") + 1;

    let calendarDays: DateItem[] = [];

    for (let i = 0; i < totalDays; i++) {
      let immunableStartOfMonth = startOfMonth.clone();

      let dateItem: DateItem = {
        isSelected: false,
        momentDate: immunableStartOfMonth.add(i, "day"),
        isEnabled: this.isBelongToThisMonth(immunableStartOfMonth, month)
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

  private setTodayAsDefaultSelectedDate() {
    let today = moment().startOf("day");
    let foundDates = this.daysOfMonth
      .filter((item: DateItem) => today.isSame(item.momentDate.clone().startOf("day")));

    if (foundDates && foundDates.length > 0) {
      this.selectedDateItem = foundDates[0];
      this.selectedDateItem.isSelected = true;
    }

  }

  private isBelongToThisMonth(momentDate: moment.Moment, month: number) {

    return momentDate.month() + 1 === month;
  }

  private setMonthBack() {
    console.log(this.currentMoment["month"]);
    this.currentMoment.subtract(1, "month");
    this.renderCalender();

  }

  private setMonthForward() {
    this.currentMoment.add(1, "month");
    this.renderCalender();
  }

  private setYearBack() {
    this.currentMoment.subtract(1, "year");
    this.renderCalender();
  }
  private setYearForward() {
    this.currentMoment.add(1, "year");
    this.renderCalender();
  }

  private confirmDateSelection() {
    this.viewCtrl.dismiss(this.selectedDateItem.momentDate.toDate());
  }

  private cancel() {
    this.viewCtrl.dismiss();
  }

  public showCalendar() {
    this.calendarModal = this.modalCtrl.create(DatePicker);
    this.calendarModal.onDidDismiss( ( data: any ) => {
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
