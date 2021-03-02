(function (){
    getFlightsWithCostLimitAndArrivalTime()
})()

async function getFlightsWithCostLimitAndArrivalTime(costs=250, arrivalTime='16:00:00'){
    try {
        let arrivals = await fetchDataFromRyanair();
        arrivals = filterArrivalsWithArrivalTime(arrivals.fares,arrivalTime);
        appendAriivalsToList(arrivals);
    } catch (e){
        console.error(e.message);
    }
}

async function fetchDataFromRyanair(fareType='oneWayFares', airportCode='KRK',
                                    lang='pl', limit=16,
                                    market='pl-pl', offset=0,
                                    departureDateFrom='2021-03-10',
                                    departureDateTo='2022-03-10',
                                    priceTo=150){
    const apiUrl = 'https://www.ryanair.com/api/farfnd/3/';
    const getQuery = `${fareType}?&departureAirportIataCode=${airportCode}&language=${lang}&limit=${limit}` +
        `&market=${market}&offset=${offset}&outboundDepartureDateFrom=${departureDateFrom}` +
        `&outboundDepartureDateTo=${departureDateTo}&priceValueTo=${priceTo}`;
    const url = encodeURI(apiUrl + getQuery);
    let arrivals = await fetch(url).then(res => res.json());
    return arrivals;
}

function filterArrivalsWithArrivalTime(arrivals, arrivalTime){
    const tabCondTimeTo = arrivalTime.split(':');
    const dateRegExp = new RegExp('(\\d\\d:){2}\\d\\d');
    return arrivals.filter(arrival=>{
        const tabTime = arrival.outbound.arrivalDate.match(dateRegExp)[0].split(':');
        for(let i in tabCondTimeTo){
            if(tabCondTimeTo[i]<tabTime[i]){
                return false;
            }
            if(tabCondTimeTo[i]>tabTime[i]) {
                return true;
            }
        }
        return true;
    })
}

function appendAriivalsToList(arrivals){
    const ol = document.querySelector('#arrivals-list');
    ol.innerHTML = "";
    const templateLi = document.querySelector('#arrival-li');
    for(let arr of arrivals){
        let li = templateLi.content.cloneNode(true).querySelector('li');
        li.textContent = `${arr.outbound.arrivalAirport.countryName} - ${arr.outbound.arrivalAirport.city.name} ${arr.outbound.arrivalDate}`;
        ol.appendChild(li);
    }
}