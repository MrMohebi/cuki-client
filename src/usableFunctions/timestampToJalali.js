export function timestampToJalali(timestamp) {
    let date = new Date(timestamp*1000)
    let jalaliDate = date.toLocaleDateString("fa-IR")
    return jalaliDate
}