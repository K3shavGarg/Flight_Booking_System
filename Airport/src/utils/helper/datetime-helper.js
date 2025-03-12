
function compare(arrivalTime, departureTime){
    let d1 = new Date(arrivalTime);
    let d2 = new Date(departureTime);
    console.log(d1.getTime());
    console.log(d2.getTime());
    return d1.getTime() > d2.getTime();
}


module.exports = {
    compare
}