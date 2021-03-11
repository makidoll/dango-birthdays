import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

export interface Birthday {
	name: string;
	date: string;
	color: string;
	image: string;
}

@Injectable({
	providedIn: "root",
})
export class ApiService {
	birthdays: Birthday[];

	constructor(private readonly http: HttpClient) {}

	refreshBirthdays() {
		return this.http.get<Birthday[]>("birthdays.json").pipe(
			tap(birthdays => {
				this.birthdays = birthdays;
			}),
		);
	}

	addBirthday(details: {
		name: string;
		date: Date;
		color: string;
		image: File;
	}) {
		const d: Date = details.date;
		const data = {
			...details,
			date:
				// d.getFullYear() +
				"1970" +
				"-" +
				String(d.getMonth() + 1).padStart(2, "0") +
				"-" +
				String(d.getDate()).padStart(2, "0"),
		};

		const formData = new FormData();
		for (const [key, value] of Object.entries(data)) {
			formData.set(key, value as string | Blob);
		}

		return this.http.put("api/birthday", formData);
	}

	adminPassword = "";
	adminPasswordVerified = false;

	getAdminPasswordVerified() {
		if (this.adminPasswordVerified) {
			return new Observable<{ success: boolean }>(sub => {
				sub.next({ success: true });
			});
		}
		this.adminPassword = prompt("Password?");
		return this.http.get<{ success: boolean }>("/api/verify", {
			headers: { Authorization: "Bearer " + this.adminPassword },
		});
	}

	deleteBirthday(birthday: Birthday) {
		return this.http.delete<{ success: boolean }>(
			"/api/birthday/" + btoa(JSON.stringify(birthday)),
			{
				headers: { Authorization: "Bearer " + this.adminPassword },
			},
		);
	}
}
