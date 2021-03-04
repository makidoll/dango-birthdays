import { HttpClient } from "@angular/common/http";
import {
	Component,
	ElementRef,
	NgZone,
	OnInit,
	ViewChild,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { CalendarOptions } from "@fullcalendar/angular";
import { AddBirthdayComponent } from "./add-birthday/add-birthday.component";

interface Birthday {
	name: string;
	date: string;
	color: string;
	image: string;
}

@Component({
	selector: "app-root",
	templateUrl: "./app.component.html",
	styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
	birthdays: Birthday[];

	@ViewChild("calendar", { static: true })
	calendar: { element: ElementRef<HTMLDivElement> };

	calendarStyles: HTMLStyleElement;

	calendarOptions: CalendarOptions = {
		contentHeight: "calc(100vh - 96px)",
		initialView: "dayGridMonth",
		headerToolbar: {
			start: "title",
			end: "today prev,next addBirthday",
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
		},
	};

	displayPluralName = (name: string) =>
		name.toLowerCase().endsWith("s") ? name + "'" : name + "'s";

	recommendedTextColor(hex: string) {
		const matches = hex.match(
			/^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i,
		);
		if (matches == null) return "#fff";
		const r = parseInt(matches[1], 16);
		const g = parseInt(matches[2], 16);
		const b = parseInt(matches[3], 16);
		// https://stackoverflow.com/questions/3942878/how-to-decide-font-color-in-white-or-black-depending-on-background-color
		return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? "#000" : "#fff";
	}

	constructor(
		private readonly dialog: MatDialog,
		private readonly zone: NgZone,
		private readonly http: HttpClient,
	) {}

	ngOnInit() {
		// TODO: this is really stupid
		this.calendarStyles = document.createElement("style");
		this.calendar.element.nativeElement.appendChild(this.calendarStyles);

		this.refresh();
	}

	refresh() {
		this.http.get<Birthday[]>("birthdays.json").subscribe(birthdays => {
			this.birthdays = birthdays;

			this.calendarStyles.innerHTML = this.birthdays
				.map((birthday, i) =>
					[
						`.person-${i} .fc-event-title::before{`,
						`background-image:url(`,
						birthday.image,
						")}",
					].join(""),
				)
				.join(" ");

			this.calendarOptions.events = this.birthdays.map((birthday, i) => ({
				title: this.displayPluralName(birthday.name) + " Birthday",
				// date: birthday.date,
				color: birthday.color,
				textColor: this.recommendedTextColor(birthday.color),
				rrule: { freq: "yearly", dtstart: birthday.date },
				allDay: true,
				borderColor: "transparent",
				className: "person person-" + String(i),
			}));
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
}
