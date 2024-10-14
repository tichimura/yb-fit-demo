const ctx2 = document.getElementById('awsChart').getContext('2d');

const data2 = {
datasets: [
  {
    label: 'AWS',
    cubicInterpolationMode: 'monotone',
    borderColor: 'orange',
    data: []
  },
  {
    label: 'Global',
    cubicInterpolationMode: 'monotone',
    // borderDash: [8, 4],
    borderColor: 'white',
    data: []
  }

]
};

const onRefresh2 = async chart2 => {
const now = Date.now();  
const globalcount =  await fetch('/load?cloud=' + 'global', {method:'GET', mode: "cors"}).then(response => response.text());
const awscount =  await fetch('/load?cloud=' + 'aws', {method:'GET', mode: "cors"}).then(response => response.text());
// console.log("Requesting " + period + " clients ," + localLog);
chart2.data.datasets[0].data.push({
    x: now,
    y: awscount
  });
chart2.data.datasets[1].data.push({
    x: now,
    y: globalcount
  });
};


new Chart(ctx2, {
    type: 'line',
    data: data2,
    options: {
      scales: {
        x: {
          type: 'realtime',
          realtime: {
            duration: 30000,
            refresh: 3500,
            delay: 7000,
            onRefresh: onRefresh2
          }
        },
        y: {
          title: {
            display: true,
            text: 'Value'
          },
          max: 100,
          grace: '20%',
          beginAtZero: true          
        }
      },
      interaction: {
        intersect: false
      }
    }
});

loadButton();

function loadButton(err) {
  if (err) {
      throw err;
  } document.getElementById('updateAws').addEventListener('click', async (e) => {
        var cloudElem = document.getElementById('cloud_name_aws');
        var newValues = parseInt(document.getElementById('order_value_aws').value);
        await fetch('/update?cloud=' + cloudElem.selectedOptions[0].value + '&value=' + newValues, {method:'POST', mode: "cors"}).then(response => response.text());

  });
}