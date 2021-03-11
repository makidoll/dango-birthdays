import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { ApiService } from "../api.service";

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
		private readonly api: ApiService,
		private readonly dialogRef: MatDialogRef<AddBirthdayComponent>,
	) {}

	ngOnInit(): void {}

	onDiscard() {
		this.dialogRef.close();
	}

	onSubmit() {
		if (this.form.invalid) return;
		this.form.disable();

		this.api.addBirthday(this.form.value).subscribe(
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
