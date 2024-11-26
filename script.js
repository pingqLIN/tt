document.getElementById('fareForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const origin = document.getElementById('origin').value;
    const destination = document.getElementById('destination').value;
    const apiKey = '您的 API 金鑰';

    const url = `https://routes.googleapis.com/directions/v2:computeRoutes?key=${apiKey}`;

    const requestBody = {
        origin: {
            address: origin
        },
        destination: {
            address: destination
        },
        travelMode: 'DRIVE',
        computeToll: true
    };

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': apiKey
        },
        body: JSON.stringify(requestBody)
    })
    .then(response => response.json())
    .then(data => {
        if (data.routes && data.routes.length > 0) {
            const route = data.routes[0];
            const distanceMeters = route.distanceMeters;
            const duration = route.duration;
            const tolls = route.travelAdvisory.tollInfo.estimatedPrice;

            const distanceKm = (distanceMeters / 1000).toFixed(2);
            const durationMinutes = (parseInt(duration) / 60).toFixed(2);
            const tollAmount = tolls ? `${tolls[0].units}.${tolls[0].nanos / 1e9} ${tolls[0].currencyCode}` : '無';

            document.getElementById('result').innerHTML = `
                <p>距離：${distanceKm} 公里</p>
                <p>預計時間：${durationMinutes} 分鐘</p>
                <p>預估通行費：${tollAmount}</p>
            `;
        } else {
            document.getElementById('result').innerHTML = '<p>無法計算路線，請檢查輸入的地址。</p>';
        }
    })
    .catch(error => {
        console.error('錯誤：', error);
        document.getElementById('result').innerHTML = '<p>發生錯誤，請稍後再試。</p>';
    });
});
