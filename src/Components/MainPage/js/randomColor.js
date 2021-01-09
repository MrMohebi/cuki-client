
export default function random (colorIndex) {
    let Colors= [
        '#e3c6f3',
        '#f9f8cb',
        '#d3f9de',
        '#ffd1d1',
        '#c9fafc',
        '#ffd5b9',
        '#faf7ff',
        '#ffd5d5',
        '#ffeeda'

    ];

    let random = Math.floor(Math.random()* Colors.length)
    if (colorIndex){
        return Colors[colorIndex]
    }else{
        return Colors[random]

    }
}