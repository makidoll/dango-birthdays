import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FullCalendarModule } from "@fullcalendar/angular";
import dayGridPlugin from "@fullcalendar/daygrid";
import rrulePlugin from "@fullcalendar/rrule";
import { AddBirthdayComponent } from "./add-birthday/add-birthday.component";
import { AppComponent } from "./app.component";
import { ErrorCardComponent } from "./error-card/error-card.component";
import { ImagePickerComponent } from "./image-picker/image-picker.component";
import { MaterialModule } from "./material.module";

FullCalendarModule.registerPlugins([dayGridPlugin, rrulePlugin]);

@NgModule({
	declarations: [
		AppComponent,
		AddBirthdayComponent,
		ImagePickerComponent,
		ErrorCardComponent,
	],
	imports: [
		BrowserModule.withServerTransition({ appId: 'serverApp' }),
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
