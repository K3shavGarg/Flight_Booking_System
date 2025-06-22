
function compare(arrivalTime, departureTime){
    let d1 = new Date(arrivalTime);
    let d2 = new Date(departureTime);
    return d1.getTime() > d2.getTime();
}


module.exports = {
    compare
}