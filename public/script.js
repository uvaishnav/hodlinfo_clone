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
                <td>${Math.round(item.volume, 2)}</td>
                <td class="${differenceFormatted}">${difference} %</td>
                <td class="${differenceFormatted}">${savingsFormatted}</td>
            `;
            cryptoDataElement.appendChild(row);

            totalPrice += Number(item.last);
            count++;
        });

        bestPrice = totalPrice / count;
        document.getElementById('best-price').innerText = `₹ ${bestPrice.toLocaleString()}`;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

fetchDataAndDisplay();
