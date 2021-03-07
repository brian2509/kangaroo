import LocalizedFormat from "dayjs/plugin/localizedFormat";
import utc from "dayjs/plugin/utc";
import dayjs from "dayjs";

dayjs.extend(LocalizedFormat);
dayjs.extend(utc);

export const lastUpdatedString = (dateTime: string): string => {
    const now = dayjs();
    const date = dayjs(dateTime);

    // Calc day difference based on calendar days, not 24-hour differences between days
    const dayDiff = now.diff(date.add(-date.hour(), "hours"), "days");

    if (dayDiff == 0) {
        // Same day: '13:45'
        return date.format("HH:mm");
    }
    if (dayDiff == 1) {
        // Yesterday: 'Yesterday'
        return "Yesterday";
    }
    if (dayDiff <= 7) {
        // Same week: 'Sunday'
        return date.format("dddd");
    }

    // Longer than a week: '07-03-2021' (with localization)
    return date.format("l");
};
