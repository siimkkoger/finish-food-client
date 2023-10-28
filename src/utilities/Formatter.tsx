export function prettyTimeFormat(dateTimeString: string): string {
    // Parse the input date-time string
    const date = new Date(dateTimeString);

    // Get hours, minutes, and determine AM/PM
    let hours = date.getHours();
    const minutes = ('0' + date.getMinutes()).slice(-2); // Ensure 2 digits
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    // Construct the formatted date-time string
    const formattedDate = `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)} ${hours}:${minutes} ${ampm}`;

    return formattedDate;
}