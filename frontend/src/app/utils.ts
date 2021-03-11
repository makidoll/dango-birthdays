export const displayPluralName = (name: string) =>
	name.toLowerCase().endsWith("s") ? name + "'" : name + "'s";

export function recommendedTextColor(hex: string) {
	const matches = hex.match(/^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
	if (matches == null) return "#fff";
	const r = parseInt(matches[1], 16);
	const g = parseInt(matches[2], 16);
	const b = parseInt(matches[3], 16);
	// https://stackoverflow.com/questions/3942878/how-to-decide-font-color-in-white-or-black-depending-on-background-color
	return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? "#000" : "#fff";
}
