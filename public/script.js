let prices5Min = [];
let prices1Hour = [];
let prices1Day = [];
let prices7Days = [];
let count5Min = 0;
let count1Hour = 0;
let count1Day = 0;
let count7Days = 0;

async function fetchDataAndDisplay() {
    try {
        const response = await fetch('http://localhost:3000/data'); 
        const data = await response.json();

        const cryptoDataElement = document.getElementById('crypto-data');
        cryptoDataElement.innerHTML = '';

        let bestPrice = 0;
        let totalPrice = 0;
        let count = 0;

        Object.keys(data).forEach((key, index) => {
            const item = data[key];
            const difference = ((item.buy - item.sell) / item.sell * 100).toFixed(2);
            const savings = (item.buy - item.sell).toFixed(2);
            const savingsFormatted = (savings > 0 ? '▲ ' : '▼ ') + '₹ ' + Math.abs(savings).toLocaleString();
            const differenceFormatted = (difference > 0 ? 'positive' : 'negative');

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${item.name.toUpperCase()}</td>
                <td>₹ ${Number(item.last).toLocaleString()}</td>
                <td>₹ ${Number(item.buy).toLocaleString()} / ₹ ${Number(item.sell).toLocaleString()}</td>
                <td>${Math.round(item.volume*100)/100}</td>
                <td class="${differenceFormatted}">${difference} %</td>
                <td class="${differenceFormatted}">${savingsFormatted}</td>
            `;
            cryptoDataElement.appendChild(row);

            totalPrice += Number(item.last);
            count++;

            // Push latest prices to respective arrays
            prices5Min.push(item.last);
            prices1Hour.push(item.last);
            prices1Day.push(item.last);
            prices7Days.push(item.last);
        });

        bestPrice = totalPrice / count;
        document.getElementById('best-price').innerText = `₹ ${bestPrice.toLocaleString()}`;

        // Truncate arrays to save memory
        if (prices5Min.length > 3) prices5Min.shift();
        if (prices1Hour.length > 3) prices1Hour.shift();
        if (prices1Day.length > 3) prices1Day.shift();
        if (prices7Days.length > 3) prices7Days.shift();

        // Calculate changes
        const calculateChange = (prices) => {
            if (prices.length < 2) return 0;
            const oldPrice = prices[0];
            const newPrice = prices[prices.length - 1];
            return (((newPrice - oldPrice) / oldPrice) * 100).toFixed(2);
        };

        const change5Min = calculateChange(prices5Min);
        const change1Hour = calculateChange(prices1Hour);
        const change1Day = calculateChange(prices1Day);
        const change7Days = calculateChange(prices7Days);

        document.getElementById('change-5mins').innerText = `${change5Min} %`;
        document.getElementById('change-1hour').innerText = `${change1Hour} %`;
        document.getElementById('change-1day').innerText = `${change1Day} %`;
        document.getElementById('change-7days').innerText = `${change7Days} %`;

    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Set intervals to fetch data periodically
setInterval(() => {
    fetchDataAndDisplay();
    count5Min++;
    if (count5Min >= 12) {
        prices5Min = [];
        count5Min = 0;
    }
}, 300000); // Fetch every 5 minutes

setInterval(() => {
    fetchDataAndDisplay();
    count1Hour++;
    if (count1Hour >= 1) {
        prices1Hour = [];
        count1Hour = 0;
    }
}, 3600000); // Fetch every 1 hour

setInterval(() => {
    fetchDataAndDisplay();
    count1Day++;
    if (count1Day >= 24) {
        prices1Day = [];
        count1Day = 0;
    }
}, 86400000); // Fetch every 1 day

// Initial fetch
fetchDataAndDisplay();
