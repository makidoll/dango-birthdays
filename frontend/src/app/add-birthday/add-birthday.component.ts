import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
	selector: "app-add-birthday",
	templateUrl: "./add-birthday.component.html",
	styleUrls: ["./add-birthday.component.scss"],
})
export class AddBirthdayComponent implements OnInit {
	controls = {
		name: new FormControl("", [Validators.required]),
		date: new FormControl("", [Validators.required]),
		color: new FormControl("#e91e63", [Validators.required]),
		image: new FormControl("", [Validators.required]),
	};
	form = new FormGroup(this.controls);

	error = "";

	constructor(
		private readonly http: HttpClient,
		private readonly dialogRef: MatDialogRef<AddBirthdayComponent>,
	) {}

	ngOnInit(): void {}

	onDiscard() {
		this.dialogRef.close();
	}

	onSubmit() {
		if (this.form.invalid) return;
		this.form.disable();

		const d: Date = this.form.value.date;
		const data = {
			...this.form.value,
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

		this.http.post("api/add-birthday", formData).subscribe(
			() => {
				this.dialogRef.close();
			},
			error => {
				this.error = error.error.error;
				this.form.enable();
			},
		);
	}
}
