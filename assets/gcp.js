const ctx1 = document.getElementById('gcpChart').getContext('2d');

const data1 = {
datasets: [
  {
    label: 'GCP',
    cubicInterpolationMode: 'monotone',
    borderColor: 'green',
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

const onRefresh1 = async chart => {
const now = Date.now();  
const globalcount =  await fetch('/load?cloud=' + 'global', {method:'GET', mode: "cors"}).then(response => response.text());
const gcpcount =  await fetch('/load?cloud=' + 'gcp', {method:'GET', mode: "cors"}).then(response => response.text());
// console.log("Requesting " + period + " clients ," + localLog);
chart.data.datasets[0].data.push({
    x: now,
    y: gcpcount
  });
chart.data.datasets[1].data.push({
    x: now,
    y: globalcount
  });
};


new Chart(ctx1, {
    type: 'line',
    data: data1,
    options: {
      scales: {
        x: {
          type: 'realtime',
          realtime: {
            duration: 30000,
            refresh: 3500,
            delay: 7000,
            onRefresh: onRefresh1
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
  } document.getElementById('updateGcp').addEventListener('click', async (e) => {
        var cloudElem = document.getElementById('cloud_name_gcp');
        var newValues = parseInt(document.getElementById('order_value_gcp').value);
        await fetch('/update?cloud=' + cloudElem.selectedOptions[0].value + '&value=' + newValues, {method:'POST', mode: "cors"}).then(response => response.text());

  });
}