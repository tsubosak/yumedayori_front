import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"

dayjs.extend(utc)
dayjs.extend(timezone)

export { dayjs }

export const calcSecondsTomorrow = () => {
  return dayjs()
    .tz("Asia/Tokyo")
    .add(1, "day")
    .startOf("day")
    .diff(dayjs().tz("Asia/Tokyo"), "seconds")
}
