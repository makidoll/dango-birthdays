import { Component, OnInit } from "@angular/core";
import { ApiService, Birthday } from "../api.service";
import { recommendedTextColor } from "../utils";

@Component({
	selector: "app-admin",
	templateUrl: "./admin.component.html",
	styleUrls: ["./admin.component.scss"],
})
export class AdminComponent implements OnInit {
	displayedColumns = ["image", "name", "date", "color", "modify"];

	recommendedTextColor = recommendedTextColor;

	constructor(public readonly api: ApiService) {}

	ngOnInit(): void {
		this.refresh();
	}

	refresh() {
		this.api.refreshBirthdays().subscribe(() => {});
	}

	deleteBirthday(birthday: Birthday) {
		if (!confirm(`Are you sure you want to delete ${birthday.name}?`)) {
			return;
		}
		this.api.deleteBirthday(birthday).subscribe(
			() => {
				this.refresh();
			},
			err => {
				alert(`Failed to delete ${birthday.name}`);
			},
		);
	}
}
