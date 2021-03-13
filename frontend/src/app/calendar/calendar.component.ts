import {
	Component,
	ElementRef,
	HostListener,
	NgZone,
	OnInit,
	ViewChild,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Calendar, CalendarOptions } from "@fullcalendar/angular";
import { AddBirthdayComponent } from "../add-birthday/add-birthday.component";
import { ApiService } from "../api.service";
import { displayPluralName, recommendedTextColor } from "../utils";

@Component({
	selector: "app-calendar",
	templateUrl: "./calendar.component.html",
	styleUrls: ["./calendar.component.scss"],
})
export class CalendarComponent implements OnInit {
	@ViewChild("calendar", { static: true })
	calendar: {
		calendar: Calendar;
		element: ElementRef<HTMLDivElement>;
	};

	calendarStyles: HTMLStyleElement;

	calendarOptions: CalendarOptions = {
		contentHeight: "calc(100vh - 96px)",
		initialView: "dayGridMonth",
		headerToolbar: {
			start: "title",
			end: "today prev,next addBirthday github",
		},
		customButtons: {
			addBirthday: {
				text: "add birthday",
				click: () => {
					this.zone.run(() => {
						this.openAddBirthday();
					});
				},
			},
			github: {
				text: "",
				click: () => {
					this.zone.run(() => {
						window.location.href =
							"https://github.com/makitsune/dango-birthdays";
					});
				},
			},
		},
	};

	displayPluralName = displayPluralName;
	recommendedTextColor = recommendedTextColor;

	constructor(
		private readonly dialog: MatDialog,
		private readonly zone: NgZone,
		private readonly api: ApiService,
	) {}

	ngOnInit() {
		// TODO: this is really stupid
		this.calendarStyles = document.createElement("style");
		this.calendar.element.nativeElement.appendChild(this.calendarStyles);
		this.refresh();
	}

	refresh() {
		this.api.refreshBirthdays().subscribe(() => {
			this.calendarStyles.innerHTML = this.api.birthdays
				.map((birthday, i) =>
					[
						`.person-${i} .fc-event-title::before{`,
						`background-image:url(`,
						birthday.image,
						")}",
					].join(""),
				)
				.join(" ");

			this.calendarOptions.events = this.api.birthdays.map(
				(birthday, i) => ({
					title: this.displayPluralName(birthday.name) + " Birthday",
					// date: birthday.date,
					color: birthday.color,
					textColor: this.recommendedTextColor(birthday.color),
					rrule: { freq: "yearly", dtstart: birthday.date },
					allDay: true,
					borderColor: "transparent",
					className: "person person-" + String(i),
				}),
			);
		});
	}

	openAddBirthday() {
		const dialog = this.dialog.open(AddBirthdayComponent, {
			disableClose: true,
		});
		dialog.afterClosed().subscribe(() => {
			this.refresh();
		});
	}

	nextPrevCooldown = false;

	@HostListener("window:wheel", ["$event"]) // for window scroll events
	onWheel(event: WheelEvent) {
		if (this.nextPrevCooldown) return;
		this.nextPrevCooldown = true;

		if (event.deltaY < 0) {
			this.calendar.calendar.prev();
		} else {
			this.calendar.calendar.next();
		}

		setTimeout(() => {
			this.nextPrevCooldown = false;
		}, 100);
	}
}
