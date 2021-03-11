import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule, Routes } from "@angular/router";
import { FullCalendarModule } from "@fullcalendar/angular";
import dayGridPlugin from "@fullcalendar/daygrid";
import rrulePlugin from "@fullcalendar/rrule";
import { AddBirthdayComponent } from "./add-birthday/add-birthday.component";
import { AdminComponent } from "./admin/admin.component";
import { AdminGuard } from "./admin/admin.guard";
import { AppComponent } from "./app.component";
import { CalendarComponent } from "./calendar/calendar.component";
import { ErrorCardComponent } from "./error-card/error-card.component";
import { ImagePickerComponent } from "./image-picker/image-picker.component";
import { MaterialModule } from "./material.module";

FullCalendarModule.registerPlugins([dayGridPlugin, rrulePlugin]);

const routes: Routes = [
	{ path: "", component: CalendarComponent },
	{ path: "admin", component: AdminComponent, canActivate: [AdminGuard] },
	{ path: "**", redirectTo: "" },
];

@NgModule({
	declarations: [
		AppComponent,
		AddBirthdayComponent,
		ImagePickerComponent,
		ErrorCardComponent,
		CalendarComponent,
		AdminComponent,
	],
	imports: [
		RouterModule.forRoot(routes),
		BrowserModule,
		FullCalendarModule,
		BrowserAnimationsModule,
		MaterialModule,
		ReactiveFormsModule,
		HttpClientModule,
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
